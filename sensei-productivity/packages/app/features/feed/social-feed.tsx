'use client'

import { Button } from '@my/ui'
import { Text } from "react-native"
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { appStorage } from "../lib/storage.js"
import { GiftedChat } from 'react-native-gifted-chat'
import { useState, useEffect, useRef } from 'react'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'
import { map as promiseMap } from "bluebird";
import Markdown from "react-native-markdown-display";
import { MessageText } from "react-native-gifted-chat";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function SocialFeedScreen() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState(-1);
    const [morePreviousMessagesAvailable, setMorePreviousMessagesAvailable] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const loadingRef = useRef(true);
    const lastMessageIdRef = useRef(-1);
    const firstMessageIdRef = useRef(-1);
    const userIdRef = useRef(-1);
    const accessTokenRef = useRef("");

    const [messages, setMessages] = useState([])

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
        return <MessageText {...props} />; // default fallback
    };

    const messageToGiftedChat = async (message, token, currentUserId) => {
        const sdk = new SenseiProductivity({
            bearerAuth: `Bearer ${token}`
        });

        try {
            const postData = await sdk.users.posts.getByPostId({
                id: message.postId
            });
            const userData = await sdk.users.get({
                id: message.userId
            });

            return {
                _id: message.userId,
                text: `${userData?.firstName} ${userData?.lastName} completed a **${postData?.categoryName}** task!\n\n ${postData.caption ?? ""}`,
                createdAt: message.postDate,
                user: {
                    _id: userData.userId,
                    name: `${userData?.firstName} ${userData?.lastName}`
                },
            };
        } catch (e) {
            console.log("Failed to get post data for post", message, "returning sample format for post instead!");
            console.log(e);

            return {
                _id: message.userId,
                text: "Sample",
                createdAt: message.postDate,
                user: {
                    _id: 1
                },
            };
        }
    };

    useEffect(() => {
        async function profileFetch() {
            const accessToken = appStorage.getString("accessToken");
            if (accessToken === undefined) {
                setError("Please login and then go back to this screen");
                loadingRef.current = false;
                return;
            }

            setAccessToken(accessToken);
            accessTokenRef.current = accessToken;
            loadingRef.current = false;

            const sdk = new SenseiProductivity({
                bearerAuth: `Bearer ${accessToken}`
            });

            let profileInfo;
            try {
                profileInfo = await sdk.users.me();
                setUserId(profileInfo.userId);
                userIdRef.current = profileInfo.userId;
            } catch (e) {
                console.log(e)
                setError("Failed to get user profile. Restart the app and check your internet!");
                return;
            }

            while (loadingMessages) {
                await sleep(1000);
            }

            setLoadingMessages(true);
            try {
                const newMessages = await sdk.users.posts.feed({
                    limit: 20
                });
                if (newMessages?.length < 20) setMorePreviousMessagesAvailable(false);
                if (newMessages?.length === 0) {
                    loadingRef.current = false;
                    setLoadingMessages(false);
                    return;
                }

                firstMessageIdRef.current = newMessages[0].postId;
                lastMessageIdRef.current = newMessages?.at(-1)?.postId;

                const formattedMessages = await promiseMap(newMessages, msg => messageToGiftedChat(msg, accessToken, userId));

                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, formattedMessages),
                );
                setLoadingMessages(false)
            } catch (e) {
                console.log(e);
                setLoadingMessages(false)
                setError("Failed to get social feed. Please reload the app and check your internet connection.");
                return;
            }
            setLoadingMessages(false);
        }

        profileFetch();
    }, []);

    if (error !== "") {
        return (<Text style={{ color: "red" }}>{error ?? ""}</Text>)
    }

    useEffect(() => {
        let timeoutId;
        let isStopped = false;

        const fetchNewMessagesCallback = async () => {
            if (firstMessageIdRef.current === -1) {
                if (!isStopped) {
                    timeoutId = setTimeout(fetchNewMessagesCallback, 1000);
                }
                return;
            }

            const sdk = new SenseiProductivity({
                bearerAuth: `Bearer ${accessTokenRef.current}`
            });

            while (loadingMessages) {
                await sleep(1000);
            }

            setLoadingMessages(true);

            try {
                const newMessages = await sdk.users.posts.feed({
                    lastPostId: firstMessageIdRef.current,
                    limit: 20
                });

                if (newMessages?.length === 0) {
                    console.log("No new messages!");
                    if (!isStopped) {
                        // schedule the next polling call
                        timeoutId = setTimeout(fetchNewMessagesCallback, 1000);
                    }
                    setLoadingMessages(false);
                    return;
                }

                const formattedMessages = await promiseMap(newMessages, msg => messageToGiftedChat(msg, accessTokenRef.current, userIdRef.current));

                firstMessageIdRef.current = newMessages.at(-1).postId;
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, formattedMessages),
                );

                console.log("Captured new messages!");
                setLoadingMessages(false);
            } catch (e) {
                console.log("Failed to poll for new messages!")
                console.log(e)
            }

            if (!isStopped) {
                // schedule next polling call
                timeoutId = setTimeout(fetchNewMessagesCallback, 1000);
            }
        };

        fetchNewMessagesCallback();

        // clean up when unmounting
        return () => {
            isStopped = true;
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={() => { }}
                isScrollToBottomEnabled={morePreviousMessagesAvailable}
                renderMessageText={renderMessageText}
                loadEarlierMessagesProps={{
                    onPress: async () => {
                        while (loadingRef.current) {
                            await sleep(250);
                        }

                        const sdk = new SenseiProductivity({
                            bearerAuth: `Bearer ${accessToken}`
                        });

                        while (loadingMessages) {
                            await sleep(250);
                        }

                        setLoadingMessages(true);
                        try {
                            const feed = await sdk.users.posts.feed({
                                lastPostId: lastMessageIdRef.current,
                                limit: 20
                            });

                            if (feed?.length < 20) setMorePreviousMessagesAvailable(false);
                            if (feed?.length === 0) return;

                            lastMessageIdRef.current = feed?.at(-1)?.postId;

                            const updatedMessages = await promiseMap(feed, async msg => await messageToGiftedChat(msg, accessToken, userId));
                            setMessages(previousMessages =>
                                GiftedChat.append(previousMessages, updatedMessages),
                            );
                            setLoadingMessages(false);
                        } catch (e) {
                            console.log("Failed to fetch continuation of social feed!");
                            console.log(e);
                            setLoadingMessages(false);
                        }
                    },
                    isInfiniteScrollEnabled: true,
                    isLoading: morePreviousMessagesAvailable,
                    isAvailable: morePreviousMessagesAvailable,
                    label: "Loading earlier social feed..."
                }}
                user={{
                    _id: userId,
                }}
            />
            <Button
                icon={ChevronLeft}
                onPress={() => router.back()}
            >
                Go Home
            </Button>
        </>
    )
}
