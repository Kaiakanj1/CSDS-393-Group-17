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

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function SocialFeedScreen() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState(-1);
    const [firstMessageId, setFirstMessageId] = useState(-1);
    const [name, setName] = useState("");
    const [morePreviousMessagesAvailable, setMorePreviousMessagesAvailable] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const loadingRef = useRef(true);
    const lastMessageIdRef = useRef(-1);
    const firstMessageIdRef = useRef(-1);

    const [messages, setMessages] = useState([])

    const messageToGiftedChat = async (message, token) => {
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
                text: `${userData?.firstName} ${userData?.lastName} completed a ${postData?.categoryName} task!\n\n ${postData.caption ?? ""}`,
                createdAt: message.postDate,
                user: {
                    _id: 1,
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
            loadingRef.current = false;

            const sdk = new SenseiProductivity({
                bearerAuth: `Bearer ${accessToken}`
            });

            let profileInfo;
            try {
                profileInfo = await sdk.users.me();
                setUserId(profileInfo.userId);
                setName(`${profileInfo.firstName} ${profileInfo.lastName} `);
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
                    return;
                }

                setFirstMessageId(newMessages[0].postId);
                lastMessageIdRef.current = newMessages?.at(-1)?.postId;

                const formattedMessages = await promiseMap(newMessages, msg => messageToGiftedChat(msg, accessToken));
                console.log(formattedMessages)

                console.log("Setting messages :P")
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

    // useEffect(() => {
    //     let timeoutId;
    //     let isStopped = false; // Flag to prevent race conditions during cleanup

    //     const fetchNewMessagesCallback = async () => {
    //         console.log("Polling!")
    //         if (lastMessageIdRef.current === -1) {
    //             console.log("-1 message ID!")
    //             if (!isStopped) {
    //                 // Schedule the next call only after the current one finishes
    //                 timeoutId = setTimeout(fetchNewMessagesCallback, 1000); // Poll every 3 seconds
    //             }
    //             return;
    //         }

    //         const sdk = new SenseiProductivity({
    //             bearerAuth: `Bearer ${accessToken}`
    //         });

    //         while (loadingMessages) {
    //             await sleep(1000);
    //         }

    //         setLoadingMessages(true);

    //         const newMessages = await sdk.users.posts.feed({
    //             lastPostId: lastMessageIdRef.current,
    //             limit: 20
    //         });

    //         if (newMessages?.length < 20) setMorePreviousMessagesAvailable(false);
    //         if (newMessages?.length === 0) {
    //             console.log("No new messages!");
    //             if (!isStopped) {
    //                 // Schedule the next call only after the current one finishes
    //                 timeoutId = setTimeout(fetchNewMessagesCallback, 1000); // Poll every 3 seconds
    //             }
    //             return;
    //         }

    //         const formattedMessages = await promiseMap(newMessages, messageToGiftedChat);

    //         lastMessageIdRef.current = newMessages.at(-1).postId;
    //         setMessages(previousMessages =>
    //             GiftedChat.append(previousMessages, formattedMessages),
    //         );

    //         setLoadingMessages(false);

    //         if (!isStopped) {
    //             // Schedule the next call only after the current one finishes
    //             timeoutId = setTimeout(fetchNewMessagesCallback, 1000); // Poll every 3 seconds
    //         }
    //     };

    //     fetchNewMessagesCallback(); // Initial call

    //     // Cleanup function to stop polling when the component unmounts or dependencies change
    //     return () => {
    //         isStopped = true;
    //         clearTimeout(timeoutId);
    //     };
    // }, []);

    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={() => { }}
                isScrollToBottomEnabled={morePreviousMessagesAvailable}
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

                            const updatedMessages = await promiseMap(feed, async msg => await messageToGiftedChat(msg, accessToken));
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
                    _id: 1,
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
