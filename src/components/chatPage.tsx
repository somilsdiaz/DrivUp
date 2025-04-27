import { useState, useEffect, FC } from "react"
import { motion } from 'framer-motion';
import { getUserId } from "../utils/auth";
import { io, Socket } from 'socket.io-client';
import { ConversationData, ChatMessage, MessageData } from "../types/chat";
import ConversationList from "./RutasProgramadas/ChatPage/ConversationList";
import ChatContainer from "./RutasProgramadas/ChatPage/ChatContainer";
import { MessageStatus } from "./RutasProgramadas/message";

const RequestPage: FC = () => {
    // estados principales para las conversaciones
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // estados para el chat seleccionado
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

    // estados para cargar mensajes
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // estados para filtrar conversaciones
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConversations, setFilteredConversations] = useState<ConversationData[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    
    // Estado para controlar la visibilidad del chat en móvil
    const [showChat, setShowChat] = useState(false);

    // inicializa conexion con socket.io
    useEffect(() => {
        const userId = getUserId();
        if (!userId) return;

        const socketInstance = io('https://drivup-backend.onrender.com');
        setSocket(socketInstance);

        // autentica usuario en el socket
        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            socketInstance.emit('authenticate', userId);
        });

        // escucha nuevos mensajes del socket
        socketInstance.on('new_message', (message) => {
            console.log('New message received from socket:', message);

            // actualiza lista de conversaciones al recibir nuevo mensaje
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv.id === message.conversation_id) {
                        // Check if the message is from someone else and the conversation is currently selected
                        // If so, we'll mark it as read immediately
                        const isMessageFromOther = message.sender_id.toString() !== userId;
                        const isConversationOpen = selectedChat === message.conversation_id;
                        const shouldMarkAsRead = isMessageFromOther && isConversationOpen;
                        
                        return {
                            ...conv,
                            last_message: message.message_text,
                            last_message_at: message.sent_at,
                            last_sender_id: message.sender_id,
                            // If the conversation is currently open, mark as read immediately
                            is_read: message.sender_id.toString() === userId || shouldMarkAsRead,
                            unread_count: (message.sender_id.toString() === userId || shouldMarkAsRead)
                                ? "0"
                                : (parseInt(conv.unread_count) + 1).toString()
                        };
                    }
                    return conv;
                });
            });

            // si el chat esta seleccionado, maneja el mensaje
            if (selectedChat === message.conversation_id && selectedChatData) {
                const isFromCurrentUser = message.sender_id.toString() === userId;
                const isFromOtherUser = !isFromCurrentUser;

                // verifica que el mensaje pertenece al chat actual
                if (selectedChatData.chatId !== message.conversation_id) {
                    console.log('Message is for a different chat than currently selected, ignoring');
                    return;
                }

                console.log(`Message is for current chat (${selectedChatData.chatId}), from current user: ${isFromCurrentUser}`);

                // If the message is from another user and the chat is currently open,
                // we need to mark it as read immediately
                if (isFromOtherUser && socket && socket.connected) {
                    console.log('Automatically marking message as read because chat is open');
                    socket.emit('mark_as_read', {
                        conversationId: message.conversation_id,
                        userId: parseInt(userId)
                    });
                    
                    // Update the message's read status locally
                    message.is_read = true;
                }

                // crea objeto de mensaje
                const messageDate = new Date(message.sent_at);
                const newMsg: ChatMessage = {
                    id: message.id.toString(),
                    senderId: message.sender_id.toString(),
                    text: message.message_text,
                    timestamp: messageDate.toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: messageDate, // añadir fecha completa para agrupación por días
                    status: isFromCurrentUser ? (message.is_read ? 'read' as MessageStatus : 'delivered' as MessageStatus) : undefined,
                    is_read: message.is_read
                };

                // actualiza mensajes conservando los existentes
                setSelectedChatData(prev => {
                    if (!prev || prev.chatId !== message.conversation_id) {
                        console.log('Chat data changed during update, skipping message update');
                        return prev;
                    }

                    // comprueba si el mensaje ya existe
                    const messageAlreadyExists = prev.messages.some(m => m.id === newMsg.id);
                    if (messageAlreadyExists) {
                        console.log('Message already exists, not adding duplicate');
                        return prev;
                    }

                    // si es del usuario actual, busca mensaje temporal para reemplazar
                    if (isFromCurrentUser) {
                        const hasTempMessage = prev.messages.some(m =>
                            m.id.startsWith('temp-') && m.text === newMsg.text
                        );

                        if (hasTempMessage) {
                            console.log('Replacing temp message with confirmed one');
                            // reemplaza mensaje temporal con el confirmado
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

                    // agrega nuevo mensaje a los existentes
                    console.log('Adding new message to chat');
                    return {
                        ...prev,
                        messages: [...prev.messages, newMsg]
                    };
                });
            }
        });

        // escucha cuando los mensajes son leidos
        socketInstance.on('messages_read', (data) => {
            console.log('Messages read event:', data);

            // actualiza conversaciones para marcar mensajes como leidos
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

            // actualiza estado de mensajes en el chat seleccionado
            if (selectedChat === data.conversationId && selectedChatData) {
                // actualiza todos los mensajes enviados por usuario actual a "leido"
                setSelectedChatData(prev => {
                    if (!prev) return prev;

                    // obtiene userId para identificar mensajes a actualizar
                    const currentUserId = getUserId();
                    if (!currentUserId) return prev;

                    // actualiza todos los mensajes del usuario actual a estado "leido"
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
            // limpia conexion socket
            socketInstance.disconnect();
        };
    }, [selectedChat]);

    // obtiene conversaciones desde la api
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

                // obtiene roles de usuarios
                const conversationsWithRoles = await Promise.all(
                    data.map(async (conversation: ConversationData) => {
                        // determina id del otro usuario
                        const currentUserId = userId;
                        const isUser = currentUserId === conversation.user_id.toString();
                        const otherUserId = isUser ? conversation.passenger_id : conversation.user_id;

                        try {
                            // consulta el rol del usuario
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

                        // devuelve conversacion sin rol en caso de error
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

    // obtiene mensajes para una conversacion
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

            // transforma datos de api al formato esperado por el componente
            const userId = getUserId();
            const formattedMessages: ChatMessage[] = data.map(message => {
                // analiza fecha de envio
                const sentDate = new Date(message.sent_at);

                // determina estado del mensaje para los enviados por usuario actual
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
                    fullDate: sentDate, // fecha completa para agrupacion por dias
                    status: messageStatus, // estado de lectura
                    is_read: message.is_read // propiedad is_read para referencia
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

    // maneja seleccion de chat
    const handleSelectChat = async (id: number) => {
        console.log('Selecting chat ID:', id);

        // Clear any existing highlighted message data in localStorage
        // to prevent stale data from previous searches from persisting
        localStorage.removeItem('scrollToMessageId');
        localStorage.removeItem('highlightedMessageIds');
        localStorage.removeItem('totalMatches');

        // We no longer return early if it's the same chat
        // This allows reloading the chat with new highlighted messages
        // from a new search
        const isSameChat = selectedChat === id;

        // Only clear chat data if we're switching to a different chat
        if (!isSameChat) {
            setSelectedChatData(null);
            // actualiza id del chat seleccionado
            setSelectedChat(id);
        }

        // En móvil, muestra la vista de chat cuando se selecciona uno
        setShowChat(true);

        const selectedConversation = conversations.find(conv => conv.id === id);

        if (selectedConversation) {
            const currentUserId = getUserId() || '';
            const isUser = currentUserId === selectedConversation.user_id.toString();

            // determina nombre del destinatario segun quien sea el usuario actual
            const recipientName = isUser
                ? `${selectedConversation.passenger_name} ${selectedConversation.passenger_last_name}`
                : `${selectedConversation.user_name} ${selectedConversation.user_last_name}`;

            // determina id del destinatario segun quien sea el usuario actual
            const recipientId = isUser
                ? selectedConversation.passenger_id
                : selectedConversation.user_id;

            // If it's the same chat, we only want to reset the UI if there are new search results
            if (!isSameChat || (selectedConversation.highlightedMessage && selectedConversation.highlightedMessage.id)) {
                // muestra estado de carga mientras obtiene mensajes
                setSelectedChatData({
                    chatId: id,
                    recipientName: recipientName,
                    recipientImage: '/Somil_profile.webp', // imagen por defecto hasta tener imagenes reales
                    recipientId: recipientId,
                    messages: [], // comienza con mensajes vacios para evitar mostrar mensajes antiguos
                    currentUserId: currentUserId,
                    recipientRole: selectedConversation.recipientRole
                });
            }

            // si hay mensajes no leidos, los marca como leidos al abrir el chat
            if (parseInt(selectedConversation.unread_count) > 0) {
                // actualiza estado local para mostrar mensajes como leidos
                setConversations(prevConversations => {
                    return prevConversations.map(conv =>
                        conv.id === id
                            ? { ...conv, unread_count: "0" }
                            : conv
                    );
                });

                // si hay conexion socket, emite evento mark_as_read
                if (socket && socket.connected) {
                    socket.emit('mark_as_read', {
                        conversationId: id,
                        userId: parseInt(currentUserId)
                    });
                    console.log('Marked messages as read for conversation:', id);
                }
            }

            // obtiene mensajes para esta conversacion
            const messages = await fetchMessages(id);

            // actualiza datos del chat con mensajes obtenidos
            if (messages.length > 0) {
                // asegura que seguimos en el mismo chat
                setSelectedChatData(prev => {
                    if (prev && prev.chatId === id) {
                        return {
                            ...prev,
                            messages: messages // reemplaza con mensajes recien obtenidos
                        };
                    }
                    return prev;
                });
            }
        }
    };

    // filtra conversaciones cuando cambia termino de busqueda o filtro
    useEffect(() => {
        // variable para controlar si el componente sigue montado
        let isMounted = true;
        
        const filterConversations = async () => {
            console.log("Ejecutando filtrado con término:", searchTerm);
            
            // aplica filtro de no leidos primero sobre todas las conversaciones
            let filtered = [...conversations].map(conv => ({
                ...conv, 
                highlightedMessage: undefined as {
                    id: string;
                    text: string;
                    originalIndex?: number;
                    totalMatches?: number;
                    matchedMessageIds?: string[];
                } | undefined
            }));
            
            if (activeFilter === 'unread') {
                filtered = filtered.filter(conversation => parseInt(conversation.unread_count) > 0);
            }
            
            // si el campo de busqueda esta vacio, solo aplicamos el filtro de no leidos
            if (!searchTerm || searchTerm.trim() === '') {
                console.log("Campo de búsqueda vacío, mostrando todas las conversaciones con filtro:", activeFilter);
                if (isMounted) {
                    setFilteredConversations(filtered);
                }
                return;
            }
            
            // obtiene id del usuario actual para busqueda
            const currentUserId = getUserId() || '';
            const searchTermLower = searchTerm.toLowerCase().trim();
            
            // busqueda en info basica (nombres y ultimo mensaje)
            const matchingByBasicInfo = filtered.filter(conversation => {
                // determina cual usuario es el destinatario (no el usuario actual)
                const isCurrentUserDriver = currentUserId === conversation.user_id.toString();
                
                // solo busca en el nombre del otro usuario (no en el usuario actual)
                const otherUserName = isCurrentUserDriver 
                    ? `${conversation.passenger_name} ${conversation.passenger_last_name}`.toLowerCase()
                    : `${conversation.user_name} ${conversation.user_last_name}`.toLowerCase();
                
                // busca en el ultimo mensaje
                const lastMessage = conversation.last_message.toLowerCase();
                const lastMessageMatches = lastMessage.includes(searchTermLower);
                
                // si hay coincidencia en el ultimo mensaje, lo destacamos
                if (lastMessageMatches) {
                    // When the last message matches, we need to also check if other messages
                    // in the conversation match the search term. We'll do this immediately
                    // rather than in a separate pass to ensure we get all matches.
                    return true; // Mark it as matching but wait to set highlightedMessage
                }
                
                return otherUserName.includes(searchTermLower);
            });
            
            // Process conversations that match by basic info to find all message matches
            // This ensures that even when the last message matches, we search for all matches
            await Promise.all(matchingByBasicInfo.map(async (conversation) => {
                try {
                    // If last message matches, we need to find all matches in history
                    const lastMessage = conversation.last_message.toLowerCase();
                    const lastMessageMatches = lastMessage.includes(searchTermLower);
                    
                    if (lastMessageMatches) {
                        // Fetch all messages for the conversation
                        const response = await fetch(`https://drivup-backend.onrender.com/conversations/${conversation.id}/messages`);
                        
                        if (!response.ok) {
                            // If we can't get messages, just highlight the last message
                            conversation.highlightedMessage = {
                                id: 'last',
                                text: conversation.last_message,
                                totalMatches: 1,
                                matchedMessageIds: ['last']
                            };
                            return;
                        }
                        
                        const messages = await response.json();
                        
                        // Find all matches in message history
                        let matchingMessages = [];
                        let matchingIndices = [];
                        
                        for (let i = 0; i < messages.length; i++) {
                            const message = messages[i];
                            if (message.message_text.toLowerCase().includes(searchTermLower)) {
                                matchingMessages.push(message);
                                matchingIndices.push(i);
                            }
                        }
                        
                        if (matchingMessages.length > 0) {
                            // Use the last message as the representative, but include all message IDs
                            conversation.highlightedMessage = {
                                id: 'last',
                                text: conversation.last_message,
                                originalIndex: messages.length - 1,
                                totalMatches: matchingMessages.length,
                                matchedMessageIds: matchingMessages.map(msg => msg.id.toString())
                            };
                        } else {
                            // Fallback if somehow the last message matches but we can't find any matches
                            // (shouldn't happen, but for safety)
                            conversation.highlightedMessage = {
                                id: 'last',
                                text: conversation.last_message,
                                totalMatches: 1,
                                matchedMessageIds: ['last']
                            };
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching message history for conversation ${conversation.id}:`, error);
                    // Fall back to just highlighting the last message
                    if (conversation.last_message.toLowerCase().includes(searchTermLower)) {
                        conversation.highlightedMessage = {
                            id: 'last',
                            text: conversation.last_message,
                            totalMatches: 1,
                            matchedMessageIds: ['last']
                        };
                    }
                }
            }));
            
            // busqueda avanzada en historial de mensajes
            try {
                // solo busca en conversaciones que no coincidieron con la info basica
                const conversationsToCheck = filtered.filter(conv => !matchingByBasicInfo.includes(conv));
                
                if (conversationsToCheck.length === 0) {
                    // si no hay mas conversaciones que revisar, terminamos
                    if (isMounted) {
                        setFilteredConversations(matchingByBasicInfo);
                    }
                    return;
                }
                
                // busca en cada conversacion
                const matchingByMessageHistory = await Promise.all(
                    conversationsToCheck.map(async (conversation) => {
                        try {
                            // obtiene mensajes
                            const response = await fetch(`https://drivup-backend.onrender.com/conversations/${conversation.id}/messages`);
                            
                            if (!response.ok) {
                                return null;
                            }
                            
                            const messages = await response.json();
                            
                            // busca en el contenido de cada mensaje
                            let matchingMessages = [];
                            let matchingIndices = [];
                            
                            // buscamos todos los mensajes que coinciden, no solo el primero
                            for (let i = 0; i < messages.length; i++) {
                                const message = messages[i];
                                if (message.message_text.toLowerCase().includes(searchTermLower)) {
                                    matchingMessages.push(message);
                                    matchingIndices.push(i);
                                }
                            }
                            
                            if (matchingMessages.length > 0) {
                                // guardamos la información de todos los mensajes destacados
                                // pero usamos el primero como representativo para mostrar en la lista
                                conversation.highlightedMessage = {
                                    id: matchingMessages[0].id.toString(),
                                    text: matchingMessages[0].message_text,
                                    originalIndex: matchingIndices[0],
                                    totalMatches: matchingMessages.length,
                                    matchedMessageIds: matchingMessages.map(msg => msg.id.toString())
                                };
                                return conversation;
                            }
                            
                            return null;
                        } catch (error) {
                            console.error(`Error buscando en mensajes para conversacion ${conversation.id}:`, error);
                            return null;
                        }
                    })
                );
                
                // combina resultados de ambas busquedas
                const matchingFromHistory = matchingByMessageHistory.filter((conv): conv is ConversationData & {
                    highlightedMessage: {
                        id: string;
                        text: string;
                        originalIndex?: number;
                        totalMatches?: number;
                        matchedMessageIds?: string[];
                    } | undefined;
                } => conv !== null);
                
                const finalResults = [...matchingByBasicInfo, ...matchingFromHistory];
                
                console.log(`Búsqueda completada. Encontradas ${finalResults.length} conversaciones.`);
                
                // actualiza estado solo si el componente sigue montado
                if (isMounted) {
                    setFilteredConversations(finalResults);
                }
            } catch (error) {
                console.error("Error en búsqueda:", error);
                // en caso de error, mostramos al menos las coincidencias basicas
                if (isMounted) {
                    setFilteredConversations(matchingByBasicInfo);
                }
            }
        };
        
        // ejecutamos la funcion de filtrado
        filterConversations();
        
        // limpieza cuando el componente se desmonta o los dependencias cambian
        return () => {
            isMounted = false;
        };
    }, [searchTerm, activeFilter, conversations]);
    
    // maneja cambios en el campo de busqueda
    const handleSearchChange = (value: string) => {
        console.log("Término de búsqueda cambiado a:", value);
        setSearchTerm(value);
    };

    // maneja envio de mensaje
    const handleMessageSent = (conversationId: number, messageText: string) => {
        // actualiza lista de conversaciones con nuevo ultimo mensaje
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
                        unread_count: "0" // reinicia no leidos ya que somos el remitente
                    }
                    : conv
            );

            // ordena conversaciones por last_message_at (mas recientes primero)
            return [...updatedConversations].sort((a, b) =>
                new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
            );
        });
    };

    // maneja cambios de filtro
    const handleFilterChange = (filter: 'all' | 'unread') => {
        setActiveFilter(filter);
    };
    
    // maneja regreso a la lista de conversaciones en móvil
    const handleBackToList = () => {
        setShowChat(false);
    };

    return (
        <main className="h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
            <div className="container mx-auto py-3 md:py-6 px-2 md:px-4 h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-2 md:mb-4 hidden md:block"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0a0d35] mb-1 md:mb-2">Ponerse de acuerdo es fácil</h1>
                    <p className="text-[#4A4E69]/80 max-w-3xl text-sm md:text-base">Utiliza el chat para comunicarte con otros usuarios del sistema -ya seas conductor o pasajero- Define horarios, puntos de encuentro y los terminos del viaje de manera colaborativa y efectiva.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row h-full bg-white rounded-xl shadow-xl overflow-hidden border border-[#4A4E69]/10 transition-all duration-300 hover:shadow-2xl">
                    {/* lista de conversaciones (izquierda) */}
                    <div className={`w-full md:w-1/3 ${showChat ? 'hidden md:block' : 'block'}`}>
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
                    </div>

                    {/* area de chat (derecha) */}
                    <div className={`w-full md:w-2/3 flex flex-col bg-[#F8F9FA] relative ${showChat ? 'block' : 'hidden md:block'}`}>
                        <ChatContainer
                            selectedChat={selectedChat}
                            selectedChatData={selectedChatData}
                            isLoadingMessages={isLoadingMessages}
                            messagesError={messagesError}
                            handleSelectChat={handleSelectChat}
                            handleMessageSent={handleMessageSent}
                            socket={socket}
                            onBackToList={handleBackToList}
                            showBackButton={true}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RequestPage;