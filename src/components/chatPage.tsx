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

    // estado para controlar la visibilidad del chat en movil
    const [showChat, setShowChat] = useState(false);

    // inicializa conexion con socket.io para comunicacion en tiempo real
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
                        // verifica si el mensaje es de otra persona y si la conversacion esta seleccionada
                        const isMessageFromOther = message.sender_id.toString() !== userId;
                        const isConversationOpen = selectedChat === message.conversation_id;
                        const shouldMarkAsRead = isMessageFromOther && isConversationOpen;
                        
                        return {
                            ...conv,
                            last_message: message.message_text,
                            last_message_at: message.sent_at,
                            last_sender_id: message.sender_id,
                            // marca como leido si la conversacion esta abierta
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

                // marca como leido automaticamente si el mensaje es de otro usuario y el chat esta abierto
                if (isFromOtherUser && socket && socket.connected) {
                    console.log('Automatically marking message as read because chat is open');
                    socket.emit('mark_as_read', {
                        conversationId: message.conversation_id,
                        userId: parseInt(userId)
                    });
                    
                    // actualiza estado de lectura localmente
                    message.is_read = true;
                }

                // crea objeto de mensaje para la interfaz
                const messageDate = new Date(message.sent_at);
                const newMsg: ChatMessage = {
                    id: message.id.toString(),
                    senderId: message.sender_id.toString(),
                    text: message.message_text,
                    timestamp: messageDate.toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: messageDate,
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

                // obtiene roles de usuarios para mostrar badges especiales
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

    // obtiene mensajes para una conversacion especifica
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
                    fullDate: sentDate,
                    status: messageStatus,
                    is_read: message.is_read
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

    // maneja seleccion de chat y carga sus mensajes
    const handleSelectChat = async (id: number) => {
        console.log('Selecting chat ID:', id);

        // limpia datos de resaltado de mensajes previos
        localStorage.removeItem('scrollToMessageId');
        localStorage.removeItem('highlightedMessageIds');
        localStorage.removeItem('totalMatches');

        // verifica si es el mismo chat o uno diferente
        const isSameChat = selectedChat === id;

        // solo limpia datos si cambiamos a un chat diferente
        if (!isSameChat) {
            setSelectedChatData(null);
            setSelectedChat(id);
        }

        // muestra vista de chat en movil
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
                
            // Establece la imagen por defecto inmediatamente
            const defaultImage = '/default-profile.png';
            
            // reset ui solo si es un chat diferente o hay resultados de busqueda nuevos
            if (!isSameChat || (selectedConversation.highlightedMessage && selectedConversation.highlightedMessage.id)) {
                // establece datos iniciales con imagen por defecto mientras carga la real
                setSelectedChatData({
                    chatId: id,
                    recipientName: recipientName,
                    recipientImage: defaultImage,
                    recipientId: recipientId,
                    messages: [],
                    currentUserId: currentUserId,
                    recipientRole: selectedConversation.recipientRole
                });
            }
            
            // Ahora intenta obtener la imagen real en segundo plano
            try {
                const profileResponse = await fetch(`http://localhost:5000/usuario/${recipientId}/foto-perfil`);
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    if (profileData.fotoPerfil) {
                        // Solo actualiza la imagen cuando está disponible
                        setSelectedChatData(prev => {
                            if (prev && prev.chatId === id) {
                                return {
                                    ...prev,
                                    recipientImage: `http://localhost:5000/uploads/${profileData.fotoPerfil}`
                                };
                            }
                            return prev;
                        });
                    }
                }
            } catch (error) {
                console.error('Error al obtener imagen de perfil:', error);
                // La imagen por defecto ya está establecida, no necesita hacer nada más
            }

            // marca mensajes como leidos cuando se abre el chat
            if (parseInt(selectedConversation.unread_count) > 0) {
                // actualiza ui para mostrar como leidos
                setConversations(prevConversations => {
                    return prevConversations.map(conv =>
                        conv.id === id
                            ? { ...conv, unread_count: "0" }
                            : conv
                    );
                });

                // notifica al servidor via socket
                if (socket && socket.connected) {
                    socket.emit('mark_as_read', {
                        conversationId: id,
                        userId: parseInt(currentUserId)
                    });
                    console.log('Marked messages as read for conversation:', id);
                }
            }

            // carga mensajes para esta conversacion
            const messages = await fetchMessages(id);

            // actualiza datos del chat con mensajes obtenidos
            if (messages.length > 0) {
                // verifica que seguimos en el mismo chat
                setSelectedChatData(prev => {
                    if (prev && prev.chatId === id) {
                        return {
                            ...prev,
                            messages: messages
                        };
                    }
                    return prev;
                });
            }
        }
    };

    // sistema de busqueda y filtrado de conversaciones
    useEffect(() => {
        // variable para control de componente montado
        let isMounted = true;
        
        const filterConversations = async () => {
            console.log("Ejecutando filtrado con término:", searchTerm);
            
            // aplica filtro de no leidos primero
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
            
            // si no hay termino de busqueda, solo aplica filtro de no leidos
            if (!searchTerm || searchTerm.trim() === '') {
                console.log("Campo de búsqueda vacío, mostrando todas las conversaciones con filtro:", activeFilter);
                if (isMounted) {
                    setFilteredConversations(filtered);
                }
                return;
            }
            
            // busqueda basica en nombres y ultimo mensaje
            const currentUserId = getUserId() || '';
            const searchTermLower = searchTerm.toLowerCase().trim();
            
            // primera fase: busqueda en datos basicos
            const matchingByBasicInfo = filtered.filter(conversation => {
                // determina cual usuario es el destinatario
                const isCurrentUserDriver = currentUserId === conversation.user_id.toString();
                
                // busca en el nombre del otro usuario
                const otherUserName = isCurrentUserDriver 
                    ? `${conversation.passenger_name} ${conversation.passenger_last_name}`.toLowerCase()
                    : `${conversation.user_name} ${conversation.user_last_name}`.toLowerCase();
                
                // busca en el ultimo mensaje
                const lastMessage = conversation.last_message.toLowerCase();
                const lastMessageMatches = lastMessage.includes(searchTermLower);
                
                if (lastMessageMatches) {
                    return true;
                }
                
                return otherUserName.includes(searchTermLower);
            });
            
            // procesa conversaciones con coincidencias basicas para buscar todos los mensajes
            await Promise.all(matchingByBasicInfo.map(async (conversation) => {
                try {
                    // si hay coincidencia en ultimo mensaje, busca todas las coincidencias
                    const lastMessage = conversation.last_message.toLowerCase();
                    const lastMessageMatches = lastMessage.includes(searchTermLower);
                    
                    if (lastMessageMatches) {
                        // obtiene todos los mensajes de la conversacion
                        const response = await fetch(`https://drivup-backend.onrender.com/conversations/${conversation.id}/messages`);
                        
                        if (!response.ok) {
                            // si no puede obtener mensajes, destaca solo el ultimo
                            conversation.highlightedMessage = {
                                id: 'last',
                                text: conversation.last_message,
                                totalMatches: 1,
                                matchedMessageIds: ['last']
                            };
                            return;
                        }
                        
                        const messages = await response.json();
                        
                        // busca todas las coincidencias en el historial
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
                            // usa el ultimo mensaje como representativo, pero incluye todos los ids
                            conversation.highlightedMessage = {
                                id: 'last',
                                text: conversation.last_message,
                                originalIndex: messages.length - 1,
                                totalMatches: matchingMessages.length,
                                matchedMessageIds: matchingMessages.map(msg => msg.id.toString())
                            };
                        } else {
                            // fallback por seguridad
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
                    // fallback a destacar solo el ultimo mensaje
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
            
            // segunda fase: busqueda avanzada en historial completo
            try {
                // solo busca en conversaciones sin coincidencias basicas
                const conversationsToCheck = filtered.filter(conv => !matchingByBasicInfo.includes(conv));
                
                if (conversationsToCheck.length === 0) {
                    // no hay mas conversaciones para revisar
                    if (isMounted) {
                        setFilteredConversations(matchingByBasicInfo);
                    }
                    return;
                }
                
                // busca en historial completo de cada conversacion
                const matchingByMessageHistory = await Promise.all(
                    conversationsToCheck.map(async (conversation) => {
                        try {
                            // obtiene todos los mensajes
                            const response = await fetch(`https://drivup-backend.onrender.com/conversations/${conversation.id}/messages`);
                            
                            if (!response.ok) {
                                return null;
                            }
                            
                            const messages = await response.json();
                            
                            // busca en cada mensaje
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
                                // guarda info de todos los mensajes coincidentes
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
                
                if (isMounted) {
                    setFilteredConversations(finalResults);
                }
            } catch (error) {
                console.error("Error en búsqueda:", error);
                // en caso de error, muestra al menos coincidencias basicas
                if (isMounted) {
                    setFilteredConversations(matchingByBasicInfo);
                }
            }
        };
        
        filterConversations();
        
        return () => {
            isMounted = false;
        };
    }, [searchTerm, activeFilter, conversations]);
    
    // maneja cambios en el campo de busqueda
    const handleSearchChange = (value: string) => {
        console.log("Término de búsqueda cambiado a:", value);
        setSearchTerm(value);
    };

    // actualiza conversaciones cuando se envia un mensaje
    const handleMessageSent = (conversationId: number, messageText: string) => {
        // actualiza lista con el nuevo mensaje
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
                        unread_count: "0"
                    }
                    : conv
            );

            // reordena conversaciones por fecha (recientes primero)
            return [...updatedConversations].sort((a, b) =>
                new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
            );
        });
    };

    // cambia filtro entre todos y no leidos
    const handleFilterChange = (filter: 'all' | 'unread') => {
        setActiveFilter(filter);
    };
    
    // regresa a lista de conversaciones en movil
    const handleBackToList = () => {
        setShowChat(false);
    };

    return (
        <main className="h-full bg-gradient-to-b from-[#F8F9FA] to-white overflow-hidden">
            <div className="container mx-auto py-3 md:py-6 px-2 md:px-4 h-full flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-2 md:mb-4 hidden md:block flex-shrink-0"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0a0d35] mb-1 md:mb-2">Ponerse de acuerdo es fácil</h1>
                    <p className="text-[#4A4E69]/80 max-w-3xl text-sm md:text-base">Utiliza el chat para comunicarte con otros usuarios del sistema -ya seas conductor o pasajero- Define horarios, puntos de encuentro y los terminos del viaje de manera colaborativa y efectiva.</p>
                </motion.div>

                {/* contenedor principal con altura fija para correcto funcionamiento en diferentes dispositivos */}
                <div className="flex-grow h-[calc(100vh-90px)] md:h-[calc(100vh-120px)]">
                    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-white rounded-xl shadow-xl border border-[#4A4E69]/10 transition-all duration-300 hover:shadow-2xl">
                        {/* lista de conversaciones (izquierda) */}
                        <div className={`w-full md:w-1/3 h-full border-r border-[#4A4E69]/10 ${showChat ? 'hidden md:block' : 'block'}`}>
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
                        <div className={`w-full md:w-2/3 h-full flex flex-col bg-[#F8F9FA] ${showChat ? 'block' : 'hidden md:block'}`}>
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
            </div>
        </main>
    );
}

export default RequestPage;