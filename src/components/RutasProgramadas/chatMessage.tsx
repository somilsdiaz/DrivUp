import React, { useState, useEffect, useRef } from 'react';
import InfoPasajeroProfile from './infoPasajeroProfile';
import { motion } from 'framer-motion';
import { Message, ChatMessageProps } from './chatMessage/chatTypes';
import ChatHeader from './chatMessage/ChatHeader';
import MessageList from './chatMessage/MessageList';
import MessageInput from './chatMessage/MessageInput';
import ErrorMessage from './chatMessage/ErrorMessage';

// componente principal para la interfaz de chat entre usuarios
const ChatMessage: React.FC<ChatMessageProps> = ({
    chatId,
    recipientName,
    recipientImage,
    recipientId,
    messages,
    currentUserId,
    onMessageSent,
    socket,
    onBackToList,
    showBackButton
}) => {
    // estados para gestionar la interfaz de chat
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    // variable para controlar si debemos hacer scroll al último mensaje
    const [preventAutoScroll, setPreventAutoScroll] = useState(false);
    // seguimiento de cambios en mensajes destacados
    const [highlightedMessageChanged, setHighlightedMessageChanged] = useState(0);
    
    // referencias para manipulación del dom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const firstRenderRef = useRef(true);

    // detecta cambios en localStorage para resaltar mensajes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'scrollToMessageId' || e.key === 'highlightedMessageIds' || e.key === 'totalMatches') {
                console.log('ChatMessage: Detected localStorage change for highlights', e.key);
                // Trigger a re-render by updating the state
                setHighlightedMessageChanged(prev => prev + 1);
            }
        };
        
        // manejador de eventos personalizados para actualizaciones de resaltado
        const handleHighlightUpdated = (e: CustomEvent) => {
            console.log('ChatMessage: Received highlightUpdated event', e.detail);
            setHighlightedMessageChanged(prev => prev + 1);
        };
        
        // escucha eventos de almacenamiento (soporte multi-pestaña)
        window.addEventListener('storage', handleStorageChange);
        // escucha evento personalizado para resaltado
        window.addEventListener('highlightUpdated', handleHighlightUpdated as EventListener);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('highlightUpdated', handleHighlightUpdated as EventListener);
        };
    }, []);

    // gestiona eventos de socket para comunicación en tiempo real
    useEffect(() => {
        if (!socket) return;

        // confirmación de mensaje enviado
        const handleMessageSent = (message: any) => {
            console.log('Message sent confirmation received:', message);
            
            // actualiza mensajes locales preservando el id para animación
            setLocalMessages(prev => {
                // busca mensaje temporal coincidente
                const tempMessage = prev.find(msg => 
                    msg.id.startsWith('temp-') && 
                    msg.text === (message.message_text || message.text)
                );
                
                if (tempMessage) {
                    console.log('Found matching temp message to update:', tempMessage);
                    // actualiza el contenido pero preserva la clave para estabilidad visual
                    return prev.map(msg => 
                        (msg.id === tempMessage.id)
                            ? { 
                                ...msg, 
                                id: message.id.toString(),
                                _originalId: msg.id, // mantiene id original para renderizado estable
                                status: 'delivered' as const,
                                timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                            }
                            : msg
                    );
                } else {
                    // busca cualquier mensaje temporal si no hay coincidencia específica
                    const anyTempMessage = prev.find(msg => msg.id.startsWith('temp-'));
                    
                    if (anyTempMessage) {
                        console.log('Found non-specific temp message to update:', anyTempMessage);
                        return prev.map(msg => 
                            msg.id.startsWith('temp-')
                                ? { 
                                    ...msg, 
                                    id: message.id.toString(),
                                    _originalId: msg.id, // mantiene estabilidad de clave
                                    status: 'delivered' as const,
                                    timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                                : msg
                        );
                    } else {
                        // agrega nuevo mensaje si no hay mensajes temporales
                        console.log('No temp message found, adding new message');
                        const newConfirmedMessage: Message = {
                            id: message.id.toString(),
                            senderId: currentUserId,
                            text: message.message_text || message.text,
                            timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            status: 'delivered' as const
                        };
                        return [...prev, newConfirmedMessage];
                    }
                }
            });
            
            setIsSending(false);
        };

        // maneja cuando los mensajes son leídos por el destinatario
        const handleMessagesRead = (data: { conversationId: number, readBy: number }) => {
            if (parseInt(chatId) === data.conversationId) {
                // actualiza todos los mensajes a estado 'leído'
                setLocalMessages(prev => prev.map(msg => 
                    msg.senderId === currentUserId 
                        ? { ...msg, status: 'read' } 
                        : msg
                ));
            }
        };

        // maneja nuevos mensajes entrantes
        const handleNewMessage = (message: any) => {
            // solo procesa mensajes para el chat actual y de otros usuarios
            if (parseInt(chatId) === message.conversation_id && 
                message.sender_id.toString() !== currentUserId) {
                
                console.log('ChatMessage: New message received in current chat, marking as read');
                
                // marca como leído inmediatamente
                socket.emit('mark_as_read', {
                    conversationId: parseInt(chatId),
                    userId: parseInt(currentUserId)
                });
            }
        };

        // maneja errores de envío
        const handleMessageError = (error: any) => {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            setIsSending(false);
        };

        // suscripción a eventos de socket
        socket.on('message_sent', handleMessageSent);
        socket.on('message_error', handleMessageError);
        socket.on('messages_read', handleMessagesRead);
        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('message_sent', handleMessageSent);
            socket.off('message_error', handleMessageError);
            socket.off('messages_read', handleMessagesRead);
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, chatId, currentUserId]);

    // marca mensajes como leídos cuando el usuario ve el chat
    useEffect(() => {
        if (!socket || !chatId || messages.length === 0) return;
        
        // omite la primera renderización para evitar llamadas innecesarias
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        // verifica si hay mensajes del destinatario
        const hasRecipientMessages = messages.some(msg => msg.senderId !== currentUserId);
        
        if (hasRecipientMessages) {
            // envía evento para marcar mensajes como leídos
            socket.emit('mark_as_read', {
                conversationId: parseInt(chatId),
                userId: parseInt(currentUserId)
            });
        }
    }, [socket, chatId, messages, currentUserId]);

    // reinicia mensajes locales cuando cambia chatId
    useEffect(() => {
        console.log('Chat ID changed, resetting local messages');
        setLocalMessages(messages);
        setSendError(null);
        setIsSending(false);
        
        // reinicia estados de interfaz
        setShowEmojis(false);
        setShowInfoModal(false);
        
        // reinicia para marcar mensajes como leídos
        firstRenderRef.current = true;
        
        // verifica mensajes destacados para este chat
        const hasHighlightedMessage = localStorage.getItem('scrollToMessageId') !== null;
        
        // controla comportamiento de desplazamiento
        setPreventAutoScroll(hasHighlightedMessage);
        
        // limpia elementos destacados al desmontar
        return () => {
            document.querySelectorAll('[data-highlighted="true"]').forEach(el => {
                el.classList.remove('bg-[#F2B134]/10', 'bg-[#F2B134]/20');
                el.removeAttribute('data-highlighted');
            });
        };
    }, [chatId, messages]);

    // actualiza mensajes locales cuando cambian los mensajes recibidos
    useEffect(() => {
        // omite si no hay mensajes para evitar borrar mensajes existentes
        if (messages.length === 0) return;
        
        console.log('Messages prop updated:', messages);
        console.log('Current local messages:', localMessages);
        
        // fusiona mensajes preservando estado local y nuevos datos
        // crea mapas para búsquedas rápidas
        const incomingMessagesMap = new Map();
        messages.forEach(msg => {
            incomingMessagesMap.set(msg.id, msg);
        });
        
        const localMessagesMap = new Map();
        localMessages.forEach(msg => {
            // omite mensajes temporales para manejo especial
            if (!msg.id.startsWith('temp-')) {
                localMessagesMap.set(msg.id, msg);
            }
        });
        
        // preserva mensajes temporales del usuario actual
        const tempMessages = localMessages.filter(msg => 
            msg.id.startsWith('temp-') && 
            msg.senderId === currentUserId
        );
        
        // combina mensajes de ambas fuentes eliminando duplicados
        const mergedMessagesMap = new Map([...localMessagesMap, ...incomingMessagesMap]);
        
        // convierte el mapa fusionado a array
        const mergedMessages = [...mergedMessagesMap.values()];
        
        // aplica estado de lectura desde mensajes locales o determina según propiedad is_read
        const finalMessages = mergedMessages.map(msg => {
            const existingMsg = localMessages.find(localMsg => localMsg.id === msg.id);
            
            if (msg.senderId === currentUserId) {
                // preserva estado si existe en mensajes locales
                if (existingMsg?.status) {
                    return {
                        ...msg,
                        status: existingMsg.status
                    };
                }
                
                // determina estado según propiedad is_read
                return {
                    ...msg,
                    status: (msg as any).is_read === true ? 'read' : 'delivered'
                };
            }
            
            return {
                ...msg,
                status: existingMsg?.status
            };
        });
        
        // añade mensajes temporales al resultado final
        const result = [...finalMessages, ...tempMessages];
        
        // ordena mensajes por id para mantener orden cronológico
        result.sort((a, b) => {
            // ordena mensajes temporales por timestamp
            if (a.id.startsWith('temp-') && b.id.startsWith('temp-')) {
                return a.id.localeCompare(b.id);
            }
            // mensajes temporales siempre después de mensajes normales
            if (a.id.startsWith('temp-')) return 1;
            if (b.id.startsWith('temp-')) return -1;
            
            // ordena por id numérico
            return parseInt(a.id) - parseInt(b.id);
        });
        
        console.log('Updated merged messages with read status:', result);
        setLocalMessages(result);
    }, [messages, currentUserId]);

    // enfoca input cuando se abre el chat
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    // desplaza a último mensaje cuando cambian los mensajes
    useEffect(() => {
        // solo realiza desplazamiento si no hay mensajes destacados
        if (!preventAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localMessages, preventAutoScroll]);

    // gestiona resaltado y desplazamiento a mensajes específicos
    useEffect(() => {
        // verifica mensajes destacados para hacer scroll
        const scrollToMessageId = localStorage.getItem('scrollToMessageId');
        const highlightedIds = localStorage.getItem('highlightedMessageIds');
        const totalMatches = localStorage.getItem('totalMatches');
        
        if (scrollToMessageId) {
            console.log(`ChatMessage: Processing highlighted messages for chat ${chatId}. Target message ID: ${scrollToMessageId}`);
        }
        
        // limpia resaltados previos
        document.querySelectorAll('[data-highlighted="true"]').forEach(el => {
            el.classList.remove('bg-[#F2B134]/10', 'bg-[#F2B134]/20');
            el.removeAttribute('data-highlighted');
        });
        
        if (scrollToMessageId) {
            console.log("Intentando hacer scroll a mensajes coincidentes:", scrollToMessageId);
            
            // activa prevención de scroll automático
            setPreventAutoScroll(true);
            
            // obtiene lista de mensajes a resaltar
            let idsToHighlight: string[] = [];
            if (highlightedIds) {
                try {
                    idsToHighlight = JSON.parse(highlightedIds);
                    console.log("Parsed highlighted IDs:", idsToHighlight);
                } catch (e) {
                    console.error("Error al parsear IDs destacados:", e);
                    idsToHighlight = [scrollToMessageId];
                }
            } else {
                idsToHighlight = [scrollToMessageId];
            }
            
            // maneja caso especial para el id 'last'
            let hasLastMessageId = idsToHighlight.includes('last');
            
            // filtra id 'last' y mapea ids reales
            let actualIdsToHighlight = idsToHighlight
                .filter(id => id !== 'last')
                .map(id => id);
            
            // mapea 'last' al id del último mensaje real
            if (hasLastMessageId && localMessages.length > 0) {
                const lastMessageId = localMessages[localMessages.length - 1].id;
                actualIdsToHighlight.push(lastMessageId);
                console.log("Mapped 'last' ID to actual last message ID:", lastMessageId);
            }
            
            // espera carga de mensajes si es necesario
            if (hasLastMessageId && actualIdsToHighlight.length === 0) {
                console.log("Waiting for messages to load before highlighting last message");
                setTimeout(() => {
                    setHighlightedMessageChanged(prev => prev + 1);
                }, 500);
                return;
            }
            
            // espera actualización del dom
            setTimeout(() => {
                // resalta mensajes encontrados
                let foundAnyMessage = false;
                let primaryMessageElement: HTMLElement | null = null;
                
                console.log("Trying to highlight messages with IDs:", actualIdsToHighlight);
                
                // procesa cada id de mensaje
                actualIdsToHighlight.forEach((msgId, index) => {
                    const messageElement = document.getElementById(`message-${msgId}`);
                    if (messageElement) {
                        foundAnyMessage = true;
                        // guarda primer elemento para scroll
                        if (index === 0) {
                            primaryMessageElement = messageElement;
                        }
                        
                        // aplica resaltado con transición visual
                        messageElement.classList.add('bg-[#F2B134]/20');
                        messageElement.setAttribute('data-highlighted', 'true');
                        setTimeout(() => {
                            if (messageElement) {
                                messageElement.classList.remove('bg-[#F2B134]/20');
                                messageElement.classList.add('bg-[#F2B134]/10');
                            }
                        }, 1000);
                    }
                });
                
                // desplaza a mensaje principal
                if (primaryMessageElement) {
                    (primaryMessageElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // muestra contador de coincidencias
                    if (totalMatches && parseInt(totalMatches) > 1) {
                        const matchCounter = document.createElement('div');
                        matchCounter.className = 'fixed bottom-20 right-8 bg-[#5AAA95] text-white px-3 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
                        matchCounter.innerHTML = `<span class="font-bold">${totalMatches}</span> coincidencias encontradas`;
                        document.body.appendChild(matchCounter);
                        
                        // elimina contador después de 5 segundos
                        setTimeout(() => {
                            if (matchCounter.parentNode) {
                                matchCounter.parentNode.removeChild(matchCounter);
                            }
                        }, 5000);
                    }
                }
                
                if (!foundAnyMessage) {
                    console.log("Ningún mensaje destacado encontrado en el DOM");
                    // permite scroll normal si no hay mensajes destacados
                    setPreventAutoScroll(false);
                }
                
                // limpia localStorage excepto para caso 'last'
                if (!(scrollToMessageId === 'last' && foundAnyMessage)) {
                    localStorage.removeItem('scrollToMessageId');
                    localStorage.removeItem('highlightedMessageIds');
                    localStorage.removeItem('totalMatches');
                }
            }, 300);
        }
    }, [messages, chatId, highlightedMessageChanged, localMessages]);

    // maneja envío de nuevos mensajes
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || isSending) return;
        
        // limpia errores previos
        setSendError(null);
        setIsSending(true);
        
        const messageText = newMessage.trim();
        
        // genera id temporal único basado en timestamp
        const now = Date.now();
        const tempMessageId = `temp-${now}`;
        
        // formatea hora para mostrar
        const currentTime = new Date(now);
        const formattedTime = currentTime.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // crea objeto de datos para el mensaje
        const messageData = {
            conversationId: parseInt(chatId),
            senderId: parseInt(currentUserId),
            receiverId: recipientId,
            messageText,
            clientTempId: tempMessageId
        };
        
        // crea mensaje optimista para mostrar inmediatamente
        const optimisticMessage: Message = {
            id: tempMessageId,
            _originalId: tempMessageId, 
            senderId: currentUserId,
            text: messageText,
            timestamp: formattedTime,
            fullDate: currentTime,
            status: 'sent'
        };
        
        // limpia input para mejorar respuesta percibida
        setNewMessage('');
        setShowEmojis(false);
        
        // añade mensaje a la interfaz inmediatamente
        setLocalMessages(prev => [...prev, optimisticMessage]);
        
        // activa scroll automático para mostrar nuevo mensaje
        setPreventAutoScroll(false);
        
        try {
            // intenta enviar por socket si está disponible
            if (socket && socket.connected) {
                socket.emit('send_message', messageData);
            } else {
                // alternativa API REST si no hay socket
                const response = await fetch('http://localhost:5000/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageData),
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to send message: ${response.status}`);
                }
                
                setIsSending(false);
            }
            
            // actualiza conversación en componente padre
            onMessageSent(parseInt(chatId), messageText);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            
            // elimina mensaje optimista
            setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
            setIsSending(false);
        }
    };
    
    // funciones auxiliares para la interfaz
    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };
    
    const toggleInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* cabecera del chat */}
            <ChatHeader 
                recipientName={recipientName}
                recipientImage={recipientImage}
                toggleInfoModal={toggleInfoModal}
                onBackToList={onBackToList}
                showBackButton={showBackButton}
            />

            {/* área de mensajes */}
            <MessageList 
                messages={localMessages}
                currentUserId={currentUserId}
                recipientName={recipientName}
                recipientImage={recipientImage}
                messagesEndRef={messagesEndRef}
                highlightedMessageChanged={highlightedMessageChanged}
            />
            
            {/* mensajes de error */}
            {sendError && (
                <ErrorMessage 
                    error={sendError} 
                    onClose={() => setSendError(null)} 
                />
            )}

            {/* área de entrada de mensajes */}
            <MessageInput 
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isSending={isSending}
                showEmojis={showEmojis}
                toggleEmojiPicker={toggleEmojiPicker}
                inputRef={inputRef}
            />

            {/* perfil del usuario */}
            <InfoPasajeroProfile
                isOpen={showInfoModal}
                onClose={toggleInfoModal}
                name={recipientName}
                image={recipientImage}
                userId={recipientId}
            />
        </motion.div>
    );
};

export default ChatMessage;