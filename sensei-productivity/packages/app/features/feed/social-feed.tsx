'use client'

import { Button } from '@my/ui'
import { Text } from "react-native"
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { appStorage } from "../lib/storage.js"
import { GiftedChat, MessageText } from 'react-native-gifted-chat'
import { useState, useEffect, useRef } from 'react'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'
import { map as promiseMap } from "bluebird";
import Markdown from "react-native-markdown-display";

export function SocialFeedScreen() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState(-1);
    
    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [morePreviousMessagesAvailable, setMorePreviousMessagesAvailable] = useState(true);
    const [messages, setMessages] = useState([]);

    const loadingRef = useRef(true);
    const loadingMessagesRef = useRef(false);
    const hasInitialMessageLoadRef = useRef(false);
    
    const oldestMessageIdRef = useRef(-1);
    const newestMessageIdRef = useRef(-1);
    
    const userIdRef = useRef(-1);
    const accessTokenRef = useRef("");

    const sortMessagesByDate = messages => messages.sort((a, b) => {
        return new Date(b.postDate) - new Date(a.postDate)
    });

    const renderMessageText = (props) => {
        const { currentMessage } = props;
        if (currentMessage && currentMessage.text) {
            return (
                <Markdown style={{
                    text: { color: props.position === 'left' ? 'black' : 'white' }
                }}>
                    {currentMessage.text}
                </Markdown>
            );
        }
        return <MessageText {...props} />; 
    };

    const messageToGiftedChat = async (message, token, currentUserId) => {
        const sdk = new SenseiProductivity({
            bearerAuth: `Bearer ${token}`
        });

        try {
            const postData = await sdk.users.posts.getByPostId({ id: message.postId });
            const userData = await sdk.users.get({ id: message.userId });

            return {
                _id: message.postId,
                text: `${userData?.firstName} ${userData?.lastName} completed a **${postData?.categoryName}** task!\n\n ${postData.caption ?? ""}`,
                createdAt: message.postDate,
                user: {
                    _id: userData.userId,
                    name: `${userData?.firstName} ${userData?.lastName}`
                },
            };
        } catch (e) {
            console.log("Failed to get post data for post", message, "returning sample format instead!", e);
            return {
                _id: message.postId,
                text: "Sample",
                createdAt: message.postDate,
                user: { _id: 1 },
            };
        }
    };

    useEffect(() => {
        async function profileFetch() {
            // react >= 18 double-queues useEffect using sleep queues
            // mitigate using an early return guard
            if (hasInitialMessageLoadRef.current) return;

            const token = appStorage.getString("accessToken");
            if (!token) {
                setError("Please login and then go back to this screen");
                loadingRef.current = false;
                return;
            }

            setAccessToken(token);
            accessTokenRef.current = token;
            loadingRef.current = false;

            const sdk = new SenseiProductivity({ bearerAuth: `Bearer ${token}` });

            try {
                const profileInfo = await sdk.users.me();
                setUserId(profileInfo.userId);
                userIdRef.current = profileInfo.userId;
            } catch (e) {
                console.log(e);
                setError("Failed to get user profile. Restart the app and check your internet!");
                return;
            }

            if (loadingMessagesRef.current) return;
            loadingMessagesRef.current = true;

            try {
                const newMessages = await sdk.users.posts.feed({ limit: 20 });
                
                if (newMessages?.length < 20) setMorePreviousMessagesAvailable(false);
                
                if (newMessages?.length > 0) {
                    const sorted = sortMessagesByDate(newMessages);
                    
                    oldestMessageIdRef.current = sorted.at(-1).postId;
                    newestMessageIdRef.current = sorted[0].postId;

                    const formattedMessages = await promiseMap(sorted, msg => messageToGiftedChat(msg, token, userIdRef.current));
                    setMessages(formattedMessages);
                }
                
                hasInitialMessageLoadRef.current = true;
            } catch (e) {
                console.log(e);
                setError("Failed to get social feed. Please reload the app and check your internet connection.");
            } finally {
                loadingMessagesRef.current = false;
            }
        }

        profileFetch();
    }, []);

    useEffect(() => {
        let timeoutId;
        let isStopped = false;

        const fetchNewMessagesCallback = async () => {
            if (newestMessageIdRef.current === -1 || !hasInitialMessageLoadRef.current || loadingMessagesRef.current) {
                if (!isStopped) timeoutId = setTimeout(fetchNewMessagesCallback, 1000);
                return;
            }

            loadingMessagesRef.current = true;
            const sdk = new SenseiProductivity({ bearerAuth: `Bearer ${accessTokenRef.current}` });

            try {
                const newMessages = await sdk.users.posts.feed({
                    lastPostId: newestMessageIdRef.current,
                    limit: 20
                });

                if (newMessages?.length > 0) {
                    const sorted = sortMessagesByDate(newMessages);
                    newestMessageIdRef.current = sorted[0].postId;

                    const formattedMessages = await promiseMap(sorted, msg => messageToGiftedChat(msg, accessTokenRef.current, userIdRef.current));
                    
                    setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessages));
                }
            } catch (e) {
                console.log("Failed to poll for new messages!", e);
            } finally {
                loadingMessagesRef.current = false;
                if (!isStopped) timeoutId = setTimeout(fetchNewMessagesCallback, 1000);
            }
        };

        timeoutId = setTimeout(fetchNewMessagesCallback, 1000);

        return () => {
            isStopped = true;
            clearTimeout(timeoutId);
        };
    }, []);

    if (error !== "") {
        return <Text style={{ color: "red" }}>{error}</Text>
    }

    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={() => { }}
                isScrollToBottomEnabled={true}
                renderMessageText={renderMessageText}
                loadEarlierMessagesProps={{
                    onPress: async () => {
                        if (loadingMessagesRef.current || isLoadingEarlier || !hasInitialMessageLoadRef.current) return;

                        setIsLoadingEarlier(true);
                        loadingMessagesRef.current = true;
                        
                        const sdk = new SenseiProductivity({ bearerAuth: `Bearer ${accessToken}` });

                        try {
                            const feed = await sdk.users.posts.feed({
                                lastPostId: oldestMessageIdRef.current, 
                                limit: 20
                            });

                            if (feed?.length < 20) setMorePreviousMessagesAvailable(false);
                            
                            if (feed?.length > 0) {
                                const sorted = sortMessagesByDate(feed);
                                oldestMessageIdRef.current = sorted[0].postId;

                                const updatedMessages = await promiseMap(sorted, msg => messageToGiftedChat(msg, accessToken, userId));
                                setMessages(previousMessages => GiftedChat.prepend(previousMessages, updatedMessages));
                            }
                        } catch (e) {
                            console.log("Failed to fetch continuation of social feed!", e);
                        } finally {
                            loadingMessagesRef.current = false;
                            setIsLoadingEarlier(false);
                        }
                    },
                    isInfiniteScrollEnabled: true,
                    isLoading: isLoadingEarlier, 
                    isAvailable: morePreviousMessagesAvailable,
                    label: "Loading earlier social feed..."
                }}
                user={{ _id: userId }}
            />
            <Button icon={ChevronLeft} onPress={() => router.back()}>
                Go Home
            </Button>
        </>
    )
}