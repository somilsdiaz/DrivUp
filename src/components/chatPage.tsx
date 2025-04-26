import { useState, useEffect, FC } from "react"
import Message from "./RutasProgramadas/message";
import ChatMessage from "./RutasProgramadas/chatMessage";
import { motion } from 'framer-motion';
import { getUserId } from "../utils/auth";
import { io, Socket } from 'socket.io-client';
import { MessageStatus } from "./RutasProgramadas/message";

// Interface for API conversation data
interface ConversationData {
    id: number;
    user_id: number;
    passenger_id: number;
    last_message_at: string;
    user_name: string;
    user_last_name: string;
    passenger_name: string;
    passenger_last_name: string;
    last_message: string;
    unread_count: string;
    last_sender_id?: number;
    is_read?: boolean;
    recipientRole?: string;
}

// Interface for API message data
interface MessageData {
    id: number;
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    message_text: string;
    is_read: boolean;
    sent_at: string;
    read_at: string | null;
    sender_name: string;
    sender_last_name: string;
}

// Definición de tipo para los mensajes de chat
interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    fullDate?: Date;
    status?: MessageStatus;
    is_read?: boolean;
}

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
                    {/* Lista de mensajes (izquierda) */}
                    <div className="w-1/3 border-r overflow-hidden relative flex flex-col">
                        <div className="p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Mensajes
                                    </h2>
                                    <p className="text-xs text-white/70">Mis conversaciones</p>
                                </div>
                                <div className="flex space-x-2">

                                </div>
                            </div>
                            <div className="mt-3 relative">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Buscar mensajes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#2D5DA1]/20 text-white placeholder-white/60 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AAA95] transition-all duration-300 group-hover:bg-[#2D5DA1]/30"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-3 transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {searchTerm && (
                                    <div className="absolute right-2 top-2.5 text-xs text-white/80 bg-[#5AAA95] px-2 py-0.5 rounded-full">
                                        {filteredConversations.length} resultados
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="divide-y divide-[#4A4E69]/10 overflow-y-auto max-h-[calc(100vh-240px)] flex-1 scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                            <div className="p-2 bg-[#F8F9FA] sticky top-0 z-10 border-b">
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="text-sm font-medium text-[#4A4E69]">Conversaciones recientes</h3>
                                    <div className="flex space-x-1">
                                        <button
                                            className={`text-xs px-2 py-1 rounded ${activeFilter === 'all' ? 'bg-white text-[#4A4E69] border border-[#4A4E69]/20' : 'text-[#4A4E69]/60 hover:bg-white'} transition-colors`}
                                            onClick={() => setActiveFilter('all')}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            className={`text-xs px-2 py-1 rounded ${activeFilter === 'unread' ? 'bg-white text-[#4A4E69] border border-[#4A4E69]/20' : 'text-[#4A4E69]/60 hover:bg-white'} transition-colors`}
                                            onClick={() => setActiveFilter('unread')}
                                        >
                                            No leídos
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="p-6 text-center text-[#4A4E69]/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-[#4A4E69]/30 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <p>Cargando conversaciones...</p>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>{error}</p>
                                </div>
                            ) : filteredConversations.length > 0 ? filteredConversations.map((conversation) => {
                                const currentUserId = getUserId() || '';
                                const isUser = currentUserId === conversation.user_id.toString();

                                // Determine the correct name to display based on who the current user is
                                const displayName = isUser
                                    ? `${conversation.passenger_name} ${conversation.passenger_last_name}`
                                    : `${conversation.user_name} ${conversation.user_last_name}`;

                                // Determine if the last message is from the current user
                                const isFromCurrentUser = conversation.last_sender_id !== undefined ?
                                    conversation.last_sender_id.toString() === currentUserId :
                                    false;

                                // Determine message status based on read status
                                let messageStatus: MessageStatus = 'sent';
                                if (isFromCurrentUser) {
                                    messageStatus = conversation.is_read === true ? 'read' : 'delivered';
                                }

                                return (
                                    <Message
                                        key={conversation.id}
                                        id={conversation.id.toString()}
                                        senderName={displayName}
                                        profileImage="/Somil_profile.webp"
                                        lastMessage={conversation.last_message}
                                        timestamp={new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        isRead={parseInt(conversation.unread_count) === 0}
                                        messageStatus={messageStatus}
                                        isFromCurrentUser={isFromCurrentUser}
                                        recipientRole={conversation.recipientRole}
                                        onSelect={(id) => handleSelectChat(parseInt(id))}
                                    />
                                );
                            }) : (
                                <div className="p-6 text-center text-[#4A4E69]/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-[#4A4E69]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <p>No se encontraron mensajes</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Área de chat (derecha) */}
                    <div className="w-2/3 flex flex-col bg-[#F8F9FA] relative">
                        {selectedChat ? (
                            <>
                                {isLoadingMessages && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2D5DA1] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <p className="mt-2 text-[#4A4E69]">Cargando mensajes...</p>
                                        </div>
                                    </div>
                                )}
                                {messagesError && (
                                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-w-md">
                                            <div className="flex">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h3 className="text-red-800 font-medium">Error al cargar mensajes</h3>
                                                    <p className="text-red-700 text-sm mt-1">{messagesError}</p>
                                                    <button
                                                        className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-md text-sm transition-colors"
                                                        onClick={() => handleSelectChat(selectedChat)}
                                                    >
                                                        Intentar de nuevo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <ChatMessage
                                    chatId={selectedChatData?.chatId.toString() || ''}
                                    recipientName={selectedChatData?.recipientName || ''}
                                    recipientImage={selectedChatData?.recipientImage || ''}
                                    recipientId={selectedChatData?.recipientId || 0}
                                    messages={selectedChatData?.messages || []}
                                    currentUserId={selectedChatData?.currentUserId || ''}
                                    onMessageSent={handleMessageSent}
                                    socket={socket}
                                />
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm"
                            >
                                <div className="text-center p-8 max-w-md">
                                    <div className="w-32 h-32 bg-gradient-to-br from-[#2D5DA1]/20 to-[#5AAA95]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#2D5DA1]/0 to-[#5AAA95]/0 group-hover:from-[#2D5DA1]/10 group-hover:to-[#5AAA95]/10 transition-all duration-500"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#2D5DA1] transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0a0d35] mb-3">Centro de Mensajes</h3>
                                    <p className="text-[#4A4E69]/80 mb-4 max-w-xs mx-auto">Selecciona un chat para ver la conversación completa y responder a tus mensajes.</p>
                                    <div className="flex flex-col space-y-3 mb-8">
                                        <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Respuesta rápida a pasajeros
                                        </div>
                                        <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Historial de conversaciones
                                        </div>
                                        <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Notificaciones en tiempo real
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RequestPage;