import { useState, useEffect, FC } from "react"
import { motion } from 'framer-motion';
import { getUserId } from "../utils/auth";
import { io, Socket } from 'socket.io-client';
import { ConversationData, ChatMessage, MessageData } from "../types/chat";
import ConversationList from "./RutasProgramadas/ChatPage/ConversationList";
import ChatContainer from "./RutasProgramadas/ChatPage/ChatContainer";
import { MessageStatus } from "./RutasProgramadas/message";

const RequestPage: FC = () => {
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [selectedChatData, setSelectedChatData] = useState<{
        chatId: number;
        recipientName: string;
        recipientImage: string;
        recipientId: number;
        messages: ChatMessage[];
        currentUserId: string;
        recipientRole?: string;
    } | null>(null);

    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Estado para filtrar mensajes
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConversations, setFilteredConversations] = useState<ConversationData[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    // Initialize Socket.io connection
    useEffect(() => {
        const userId = getUserId();
        if (!userId) return;

        const socketInstance = io('https://drivup-backend.onrender.com');
        setSocket(socketInstance);

        // Authenticate user with socket
        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            socketInstance.emit('authenticate', userId);
        });

        // Listen for new messages from socket
        socketInstance.on('new_message', (message) => {
            console.log('New message received from socket:', message);

            // Update conversation list when receiving a new message
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv.id === message.conversation_id) {
                        return {
                            ...conv,
                            last_message: message.message_text,
                            last_message_at: message.sent_at,
                            last_sender_id: message.sender_id,
                            is_read: message.sender_id.toString() === userId,
                            unread_count: message.sender_id.toString() === userId
                                ? "0"
                                : (parseInt(conv.unread_count) + 1).toString()
                        };
                    }
                    return conv;
                });
            });

            // If the chat is currently selected, handle the message
            if (selectedChat === message.conversation_id && selectedChatData) {
                const isFromCurrentUser = message.sender_id.toString() === userId;

                // Verify this message belongs to the currently selected chat
                if (selectedChatData.chatId !== message.conversation_id) {
                    console.log('Message is for a different chat than currently selected, ignoring');
                    return;
                }

                console.log(`Message is for current chat (${selectedChatData.chatId}), from current user: ${isFromCurrentUser}`);

                // Create the message object
                const messageDate = new Date(message.sent_at);
                const newMsg: ChatMessage = {
                    id: message.id.toString(),
                    senderId: message.sender_id.toString(),
                    text: message.message_text,
                    timestamp: messageDate.toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: messageDate, // Añadir fecha completa para agrupación por días
                    status: isFromCurrentUser ? (message.is_read ? 'read' as MessageStatus : 'delivered' as MessageStatus) : undefined,
                    is_read: message.is_read
                };

                // CRITICAL: We need to ensure we keep all existing messages
                setSelectedChatData(prev => {
                    if (!prev || prev.chatId !== message.conversation_id) {
                        console.log('Chat data changed during update, skipping message update');
                        return prev;
                    }

                    // First check if this exact message already exists in our messages array
                    const messageAlreadyExists = prev.messages.some(m => m.id === newMsg.id);
                    if (messageAlreadyExists) {
                        console.log('Message already exists, not adding duplicate');
                        return prev;
                    }

                    // If the message is from the current user, check for temp message to replace
                    if (isFromCurrentUser) {
                        const hasTempMessage = prev.messages.some(m =>
                            m.id.startsWith('temp-') && m.text === newMsg.text
                        );

                        if (hasTempMessage) {
                            console.log('Replacing temp message with confirmed one');
                            // Replace temp message with the confirmed one
                            return {
                                ...prev,
                                messages: prev.messages.map(m =>
                                    (m.id.startsWith('temp-') && m.text === newMsg.text)
                                        ? newMsg
                                        : m
                                )
                            };
                        }
                    }

                    // Add the new message to the existing ones
                    console.log('Adding new message to chat');
                    return {
                        ...prev,
                        messages: [...prev.messages, newMsg]
                    };
                });
            }
        });

        // Listen for messages being read
        socketInstance.on('messages_read', (data) => {
            console.log('Messages read event:', data);

            // Update conversations to mark messages as read
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv.id === data.conversationId) {
                        return {
                            ...conv,
                            is_read: true,
                            unread_count: "0"
                        };
                    }
                    return conv;
                });
            });

            // IMPORTANT: Also update the status of messages in the currently selected chat
            if (selectedChat === data.conversationId && selectedChatData) {
                // Update all messages sent by current user to "read" status
                setSelectedChatData(prev => {
                    if (!prev) return prev;

                    // Get current userId to identify which messages to update
                    const currentUserId = getUserId();
                    if (!currentUserId) return prev;

                    // Update all messages from the current user to "read" status
                    const updatedMessages = prev.messages.map(msg => {
                        if (msg.senderId === currentUserId) {
                            return {
                                ...msg,
                                status: 'read' as MessageStatus,
                                is_read: true
                            };
                        }
                        return msg;
                    });

                    return {
                        ...prev,
                        messages: updatedMessages
                    };
                });
            }
        });

        return () => {
            // Clean up socket connection
            socketInstance.disconnect();
        };
    }, [selectedChat]);

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            setError(null);

            const userId = getUserId();

            if (!userId) {
                setError("No user ID found. Please log in again.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://drivup-backend.onrender.com/conversations/${userId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch conversations: ${response.status}`);
                }

                const data = await response.json();

                // Obtenemos los roles de los usuarios
                const conversationsWithRoles = await Promise.all(
                    data.map(async (conversation: ConversationData) => {
                        // Determinar el ID del otro usuario (no el actual)
                        const currentUserId = userId;
                        const isUser = currentUserId === conversation.user_id.toString();
                        const otherUserId = isUser ? conversation.passenger_id : conversation.user_id;

                        try {
                            // Llamar al endpoint para obtener el rol
                            const roleResponse = await fetch(`https://drivup-backend.onrender.com/usuarios/${otherUserId}/role`);
                            if (roleResponse.ok) {
                                const roleData = await roleResponse.json();
                                return {
                                    ...conversation,
                                    recipientRole: roleData.role
                                };
                            }
                        } catch (error) {
                            console.error(`Error obteniendo rol para usuario ${otherUserId}:`, error);
                        }

                        // Si hay error, devolver la conversación sin rol
                        return conversation;
                    })
                );

                setConversations(conversationsWithRoles);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Fetch messages for a conversation
    const fetchMessages = async (conversationId: number) => {
        setIsLoadingMessages(true);
        setMessagesError(null);

        try {
            const response = await fetch(`https://drivup-backend.onrender.com/conversations/${conversationId}/messages`);

            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            const data: MessageData[] = await response.json();
            console.log('Fetched messages from API:', data);

            // Transform API message data to the format expected by ChatMessage component
            const userId = getUserId();
            const formattedMessages: ChatMessage[] = data.map(message => {
                // Parse the sent_at date
                const sentDate = new Date(message.sent_at);

                // Determine message status for messages sent by current user
                let messageStatus: MessageStatus | undefined = undefined;
                if (message.sender_id.toString() === userId) {
                    messageStatus = message.is_read ? 'read' as MessageStatus : 'delivered' as MessageStatus;
                }

                return {
                    id: message.id.toString(),
                    senderId: message.sender_id.toString(),
                    text: message.message_text,
                    timestamp: sentDate.toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    fullDate: sentDate, // Añadir la fecha completa para agrupación por días
                    status: messageStatus, // Añadir estado de lectura
                    is_read: message.is_read // Pasar la propiedad is_read para referencia
                };
            });

            return formattedMessages;
        } catch (err) {
            console.error('Error fetching messages:', err);
            setMessagesError(err instanceof Error ? err.message : 'Failed to fetch messages');
            return [];
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // Handle chat selection
    const handleSelectChat = async (id: number) => {
        console.log('Selecting chat ID:', id);

        // If selecting the same chat, just return
        if (selectedChat === id) return;

        // Clear current chat data before loading new one to avoid message leakage between chats
        if (selectedChat !== id) {
            setSelectedChatData(null);
        }

        // Update the selected chat ID
        setSelectedChat(id);

        const selectedConversation = conversations.find(conv => conv.id === id);

        if (selectedConversation) {
            const currentUserId = getUserId() || '';
            const isUser = currentUserId === selectedConversation.user_id.toString();

            // Determine the recipient name based on who the current user is
            const recipientName = isUser
                ? `${selectedConversation.passenger_name} ${selectedConversation.passenger_last_name}`
                : `${selectedConversation.user_name} ${selectedConversation.user_last_name}`;

            // Determine the recipient ID based on who the current user is
            const recipientId = isUser
                ? selectedConversation.passenger_id
                : selectedConversation.user_id;

            // Show loading state while fetching messages
            setSelectedChatData({
                chatId: id,
                recipientName: recipientName,
                recipientImage: '/Somil_profile.webp', // Default image until we have real profile images
                recipientId: recipientId,
                messages: [], // Start with empty messages to avoid showing old messages
                currentUserId: currentUserId,
                recipientRole: selectedConversation.recipientRole
            });

            // If there are unread messages, mark them as read when opening the chat
            if (parseInt(selectedConversation.unread_count) > 0) {
                // Update the local state immediately to show messages as read
                setConversations(prevConversations => {
                    return prevConversations.map(conv =>
                        conv.id === id
                            ? { ...conv, unread_count: "0" }
                            : conv
                    );
                });

                // If socket connection is available, emit mark_as_read event
                if (socket && socket.connected) {
                    socket.emit('mark_as_read', {
                        conversationId: id,
                        userId: parseInt(currentUserId)
                    });
                    console.log('Marked messages as read for conversation:', id);
                }
            }

            // Fetch messages for this conversation
            const messages = await fetchMessages(id);

            // Update the chat data with fetched messages
            if (messages.length > 0) {
                // Make sure we're still on the same chat (user might have switched during API call)
                setSelectedChatData(prev => {
                    if (prev && prev.chatId === id) {
                        return {
                            ...prev,
                            messages: messages // Replace with freshly fetched messages
                        };
                    }
                    return prev;
                });
            }
        }
    };

    // Filter conversations when search term or filter changes
    useEffect(() => {
        let filtered = conversations;

        // Apply unread filter
        if (activeFilter === 'unread') {
            filtered = filtered.filter(conversation => parseInt(conversation.unread_count) > 0);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(conversation =>
                `${conversation.passenger_name} ${conversation.passenger_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                conversation.last_message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredConversations(filtered);
    }, [searchTerm, activeFilter, conversations]);

    // Handle message sent
    const handleMessageSent = (conversationId: number, messageText: string) => {
        // Update the conversations list with new last message
        setConversations(prevConversations => {
            const currentUserId = getUserId();
            const updatedConversations = prevConversations.map(conv =>
                conv.id === conversationId
                    ? {
                        ...conv,
                        last_message: messageText,
                        last_message_at: new Date().toISOString(),
                        last_sender_id: currentUserId ? parseInt(currentUserId) : undefined,
                        is_read: false,
                        unread_count: "0" // Reset unread since we're the sender
                    }
                    : conv
            );

            // Sort conversations by last_message_at (most recent first)
            return [...updatedConversations].sort((a, b) =>
                new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
            );
        });
    };

    // Handle search term change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    // Handle filter change
    const handleFilterChange = (filter: 'all' | 'unread') => {
        setActiveFilter(filter);
    };

    return (
        <main className="h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
            <div className="container mx-auto py-6 px-4 h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                >
                    <h1 className="text-3xl font-bold text-[#0a0d35] mb-2">Ponerse de acuerdo es fácil</h1>
                    <p className="text-[#4A4E69]/80 max-w-3xl">Utiliza el chat para comunicarte con otros usuarios del sistema -ya seas conductor o pasajero- Define horarios, puntos de encuentro y los terminos del viaje de manera colaborativa y efectiva.</p>
                </motion.div>

                <div className="flex h-full] bg-white rounded-xl shadow-xl overflow-hidden border border-[#4A4E69]/10 transition-all duration-300 hover:shadow-2xl">
                    {/* Lista de conversaciones (izquierda) */}
                    <ConversationList
                        conversations={conversations}
                        isLoading={isLoading}
                        error={error}
                        searchTerm={searchTerm}
                        activeFilter={activeFilter}
                        filteredConversations={filteredConversations}
                        selectedChat={selectedChat}
                        onSearchChange={handleSearchChange}
                        onFilterChange={handleFilterChange}
                        onSelectChat={handleSelectChat}
                    />

                    {/* Área de chat (derecha) */}
                    <div className="w-2/3 flex flex-col bg-[#F8F9FA] relative">
                        <ChatContainer
                            selectedChat={selectedChat}
                            selectedChatData={selectedChatData}
                            isLoadingMessages={isLoadingMessages}
                            messagesError={messagesError}
                            handleSelectChat={handleSelectChat}
                            handleMessageSent={handleMessageSent}
                            socket={socket}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RequestPage;