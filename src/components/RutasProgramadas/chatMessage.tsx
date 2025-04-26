import React, { useState, useEffect, useRef } from 'react';
import InfoPasajeroProfile from './infoPasajeroProfile';
import { motion } from 'framer-motion';
import { Message, ChatMessageProps } from './chatMessage/chatTypes';
import { processMessagesWithDateSeparators } from './chatMessage/messageUtils';
import MessageBubble from './chatMessage/MessageBubble';
import DateSeparator from './chatMessage/DateSeparator';
import EmojiPicker from './chatMessage/EmojiPicker';

const ChatMessage: React.FC<ChatMessageProps> = ({
    chatId,
    recipientName,
    recipientImage,
    recipientId,
    messages,
    currentUserId,
    onMessageSent,
    socket
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    // variable para controlar si debemos hacer scroll al último mensaje
    const [preventAutoScroll, setPreventAutoScroll] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const firstRenderRef = useRef(true);

    // Listen for socket events
    useEffect(() => {
        if (!socket) return;

        // Confirmation that message was sent
        const handleMessageSent = (message: any) => {
            console.log('Message sent confirmation received:', message);
            
            // Instead of updating immediately, use a smoother transition
            // by preserving the message ID for animation purposes
            setLocalMessages(prev => {
                // Find the temp message matching both the text and temp ID
                const tempMessage = prev.find(msg => 
                    msg.id.startsWith('temp-') && 
                    msg.text === (message.message_text || message.text)
                );
                
                if (tempMessage) {
                    console.log('Found matching temp message to update:', tempMessage);
                    // Update the temp message content but preserve its key in _originalId field
                    // This prevents the message from "disappearing" visually
                    return prev.map(msg => 
                        (msg.id === tempMessage.id)
                            ? { 
                                ...msg, 
                                id: message.id.toString(),
                                _originalId: msg.id, // Keep original ID for stable rendering
                                status: 'delivered' as const,
                                timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                            }
                            : msg
                    );
                } else {
                    // If no specific temp message found, look for any temp message
                    const anyTempMessage = prev.find(msg => msg.id.startsWith('temp-'));
                    
                    if (anyTempMessage) {
                        console.log('Found non-specific temp message to update:', anyTempMessage);
                        return prev.map(msg => 
                            msg.id.startsWith('temp-')
                                ? { 
                                    ...msg, 
                                    id: message.id.toString(),
                                    _originalId: msg.id, // Keep original ID for key stability
                                    status: 'delivered' as const,
                                    timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                                : msg
                        );
                    } else {
                        // If no temp message found at all, just add the new message
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

        // Handle when messages are read by the recipient
        const handleMessagesRead = (data: { conversationId: number, readBy: number }) => {
            if (parseInt(chatId) === data.conversationId) {
                // Update all messages to 'read' status when recipient has read them
                setLocalMessages(prev => prev.map(msg => 
                    msg.senderId === currentUserId 
                        ? { ...msg, status: 'read' } 
                        : msg
                ));
            }
        };

        // Handle errors
        const handleMessageError = (error: any) => {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            setIsSending(false);
        };

        socket.on('message_sent', handleMessageSent);
        socket.on('message_error', handleMessageError);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('message_sent', handleMessageSent);
            socket.off('message_error', handleMessageError);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, chatId, currentUserId]);

    // Mark messages as read when user views the chat
    useEffect(() => {
        if (!socket || !chatId || messages.length === 0) return;
        
        // Skip on first render to avoid unnecessary calls
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        // Check if there are messages from the recipient
        const hasRecipientMessages = messages.some(msg => msg.senderId !== currentUserId);
        
        if (hasRecipientMessages) {
            // Send event to mark messages as read
            socket.emit('mark_as_read', {
                conversationId: parseInt(chatId),
                userId: parseInt(currentUserId)
            });
        }
    }, [socket, chatId, messages, currentUserId]);

    // Add a key-based reset mechanism for localMessages when chatId changes
    useEffect(() => {
        // Reset local messages completely when switching to a different chat
        console.log('Chat ID changed, resetting local messages');
        setLocalMessages(messages);
        setSendError(null);
        setIsSending(false);
        
        // Also reset UI states
        setShowEmojis(false);
        setShowInfoModal(false);
        
        // Reset the first render flag so we mark messages as read again
        firstRenderRef.current = true;
        
        // verificamos si hay un mensaje destacado para este chat
        const hasHighlightedMessage = localStorage.getItem('scrollToMessageId') !== null;
        
        // desactivamos scroll automático si hay un mensaje destacado
        setPreventAutoScroll(hasHighlightedMessage);
    }, [chatId]);

    // Update local messages when prop messages change (this will run for the same chatId)
    useEffect(() => {
        // Skip if messages array is empty to avoid clearing existing messages
        if (messages.length === 0) return;
        
        console.log('Messages prop updated:', messages);
        console.log('Current local messages:', localMessages);
        
        // IMPORTANT: Instead of replacing all messages, we need to merge them
        // ensuring we keep all messages that exist either in props or local state
        
        // 1. Create maps for faster lookups
        const incomingMessagesMap = new Map();
        messages.forEach(msg => {
            incomingMessagesMap.set(msg.id, msg);
        });
        
        const localMessagesMap = new Map();
        localMessages.forEach(msg => {
            // Skip temporary messages as they will be handled separately
            if (!msg.id.startsWith('temp-')) {
                localMessagesMap.set(msg.id, msg);
            }
        });
        
        // 2. Get temporary messages that should be preserved ONLY for the current chat
        const tempMessages = localMessages.filter(msg => 
            msg.id.startsWith('temp-') && 
            msg.senderId === currentUserId // Make sure they're from the current user
        );
        
        // 3. Combine messages from both sources and remove duplicates
        const mergedMessagesMap = new Map([...localMessagesMap, ...incomingMessagesMap]);
        
        // 4. Convert the merged map back to an array
        const mergedMessages = [...mergedMessagesMap.values()];
        
        // 5. Apply status from local messages where available, or determine based on is_read property
        const finalMessages = mergedMessages.map(msg => {
            const existingMsg = localMessages.find(localMsg => localMsg.id === msg.id);
            
            // If this message is from the current user, determine its read status
            if (msg.senderId === currentUserId) {
                // If we already have a status in local messages, preserve it
                if (existingMsg?.status) {
                    return {
                        ...msg,
                        status: existingMsg.status
                    };
                }
                
                // Otherwise, determine based on the is_read property if available
                // In API responses, is_read might be available on the message object
                return {
                    ...msg,
                    // Default to 'delivered' if is_read is undefined, otherwise use 'read' if is_read is true
                    status: (msg as any).is_read === true ? 'read' : 'delivered'
                };
            }
            
            return {
                ...msg,
                status: existingMsg?.status
            };
        });
        
        // 6. Add temp messages to the final result
        const result = [...finalMessages, ...tempMessages];
        
        // 7. Sort messages by their ID to maintain chronological order
        result.sort((a, b) => {
            // If both are temp messages, sort by their timestamp value
            if (a.id.startsWith('temp-') && b.id.startsWith('temp-')) {
                return a.id.localeCompare(b.id);
            }
            // Temp messages always come after non-temp messages
            if (a.id.startsWith('temp-')) return 1;
            if (b.id.startsWith('temp-')) return -1;
            
            // Otherwise sort by ID (assuming they're numeric or timestamp-based)
            return parseInt(a.id) - parseInt(b.id);
        });
        
        console.log('Updated merged messages with read status:', result);
        setLocalMessages(result);
    }, [messages, currentUserId]);

    // Focus input when chat opens
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    // Scroll to last message when messages change
    useEffect(() => {
        // solo hacemos scroll automático si no estamos destacando un mensaje
        if (!preventAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localMessages, preventAutoScroll]);

    // actualiza el elemento al que hacemos scroll cuando se monta el componente
    useEffect(() => {
        // verificamos si hay mensajes destacados a los que debemos hacer scroll
        const scrollToMessageId = localStorage.getItem('scrollToMessageId');
        const highlightedIds = localStorage.getItem('highlightedMessageIds');
        const totalMatches = localStorage.getItem('totalMatches');
        
        if (scrollToMessageId) {
            console.log("Intentando hacer scroll a mensajes coincidentes:", scrollToMessageId);
            
            // activamos la prevención de scroll automático
            setPreventAutoScroll(true);
            
            // obtenemos la lista de todos los mensajes a resaltar
            let idsToHighlight: string[] = [];
            if (highlightedIds) {
                try {
                    idsToHighlight = JSON.parse(highlightedIds);
                } catch (e) {
                    console.error("Error al parsear IDs destacados:", e);
                    idsToHighlight = [scrollToMessageId];
                }
            } else {
                idsToHighlight = [scrollToMessageId];
            }
            
            // esperamos a que el DOM se actualice
            setTimeout(() => {
                // resaltamos todos los mensajes encontrados
                let foundAnyMessage = false;
                let primaryMessageElement: HTMLElement | null = null;
                
                // procesar cada ID de mensaje coincidente
                idsToHighlight.forEach((msgId, index) => {
                    const messageElement = document.getElementById(`message-${msgId}`);
                    if (messageElement) {
                        foundAnyMessage = true;
                        // guardamos el primer elemento para hacer scroll hacia él
                        if (index === 0) {
                            primaryMessageElement = messageElement;
                        }
                        
                        // resaltamos todos los mensajes coincidentes
                        messageElement.classList.add('bg-[#F2B134]/20');
                        setTimeout(() => {
                            if (messageElement) {
                                messageElement.classList.remove('bg-[#F2B134]/20');
                                messageElement.classList.add('bg-[#F2B134]/10');
                            }
                        }, 1000);
                    }
                });
                
                // hacemos scroll al primer mensaje
                if (primaryMessageElement) {
                    (primaryMessageElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // mostramos indicador del total de coincidencias si hay más de una
                    if (totalMatches && parseInt(totalMatches) > 1) {
                        const matchCounter = document.createElement('div');
                        matchCounter.className = 'fixed bottom-20 right-8 bg-[#5AAA95] text-white px-3 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
                        matchCounter.innerHTML = `<span class="font-bold">${totalMatches}</span> coincidencias encontradas`;
                        document.body.appendChild(matchCounter);
                        
                        // eliminamos el contador después de 5 segundos
                        setTimeout(() => {
                            if (matchCounter.parentNode) {
                                matchCounter.parentNode.removeChild(matchCounter);
                            }
                        }, 5000);
                    }
                    
                    // después de 3 segundos, permitimos de nuevo el scroll automático
                    setTimeout(() => {
                        setPreventAutoScroll(false);
                    }, 3000);
                }
                
                if (!foundAnyMessage) {
                    console.log("Ningún mensaje destacado encontrado en el DOM");
                    // si no encontramos mensajes, permitimos scroll normal
                    setPreventAutoScroll(false);
                }
                
                // limpiamos después de usar
                localStorage.removeItem('scrollToMessageId');
                localStorage.removeItem('highlightedMessageIds');
                localStorage.removeItem('totalMatches');
            }, 300);
        }
    }, [messages, chatId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || isSending) return;
        
        // Clear previous errors
        setSendError(null);
        setIsSending(true);
        
        const messageText = newMessage.trim();
        
        // Generate a unique timestamp-based ID that will be stable
        // This helps with animation transitions later
        const now = Date.now();
        const tempMessageId = `temp-${now}`;
        
        // Format time for display
        const currentTime = new Date(now);
        const formattedTime = currentTime.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create message object
        const messageData = {
            conversationId: parseInt(chatId),
            senderId: parseInt(currentUserId),
            receiverId: recipientId,
            messageText,
            clientTempId: tempMessageId // Include temp ID for the server to reference
        };
        
        // Create optimistic message to show immediately
        const optimisticMessage: Message = {
            id: tempMessageId,
            _originalId: tempMessageId, // Store the temp ID for stable animations
            senderId: currentUserId,
            text: messageText,
            timestamp: formattedTime,
            fullDate: currentTime, // Include the full date for grouping by day
            status: 'sent'
        };
        
        // Clear input immediately to improve perceived responsiveness
        setNewMessage('');
        setShowEmojis(false);
        
        // Add message to the UI immediately
        setLocalMessages(prev => [...prev, optimisticMessage]);
        
        try {
            // Try to send via socket first if available
            if (socket && socket.connected) {
                socket.emit('send_message', messageData);
            } else {
                // Fallback to REST API if socket not available
                const response = await fetch('https://drivup-backend.onrender.com/messages', {
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
            
            // Update conversation in the parent component
            onMessageSent(parseInt(chatId), messageText);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            
            // Remove optimistic message
            setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
            setIsSending(false);
        }
    };
    
    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };
    
    const toggleInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    // Renderizar los mensajes junto con los separadores de fecha
    const renderMessagesWithSeparators = () => {
        const processedMessages = processMessagesWithDateSeparators(localMessages);
        
        return processedMessages.map((item) => {
            if ('isSeparator' in item) {
                return <DateSeparator key={`separator-${item.date}`} separator={item} />;
            }

            const isFromCurrentUser = item.senderId === currentUserId;
            
            // identificamos si este es el mensaje destacado
            const isHighlightedMessage = item.id === localStorage.getItem('scrollToMessageId');
            
            return (
                <div 
                    id={`message-${item.id}`} 
                    key={item._originalId || item.id}
                    className={isHighlightedMessage ? 'scroll-mt-8' : ''}
                >
                    <MessageBubble
                        message={item}
                        isCurrentUser={isFromCurrentUser}
                        recipientImage={recipientImage}
                        recipientName={recipientName}
                    />
                </div>
            );
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white sticky top-0 z-10">
                <div className="flex items-center">
                    <div className="relative">
                        <img 
                            src={recipientImage} 
                            alt={`${recipientName}'s profile`} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/30 transition-transform hover:scale-105"
                        />
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-white">{recipientName}</h3>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button 
                        className="p-2 rounded-full hover:bg-white/10 transition-colors" 
                        title="Información del contacto"
                        onClick={toggleInfoModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                {renderMessagesWithSeparators()}
                
                {/* Error message */}
                {sendError && (
                    <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm border border-red-200 shadow-sm flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p>{sendError}</p>
                            <button 
                                className="text-red-800 hover:text-red-900 underline text-xs mt-1"
                                onClick={() => setSendError(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Message input area */}
            <div className="border-t p-4 bg-white sticky bottom-0 z-10 shadow-md">
                <div className="flex items-center">    
                    <div className="relative flex-1 mx-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="w-full border border-[#4A4E69]/20 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent shadow-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isSending}
                        />
                        <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A4E69]/50 hover:text-[#5AAA95] transition-colors"
                            onClick={toggleEmojiPicker}
                            disabled={isSending}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        
                        {showEmojis && (
                            <EmojiPicker onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)} />
                        )}
                    </div>
                    
                    <button
                        onClick={handleSendMessage}
                        className={`ml-2 rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2B134] ${
                            isSending 
                                ? 'bg-[#F2B134]/70 text-[#4A4E69]/70 cursor-wait' 
                                : newMessage.trim() === '' 
                                ? 'bg-[#F2B134]/50 text-[#4A4E69]/50 cursor-not-allowed' 
                                : 'bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/80 shadow-md hover:shadow-lg transform hover:scale-105'
                        }`}
                        disabled={newMessage.trim() === '' || isSending}
                    >
                        {isSending ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                        <span className="sr-only">Enviar mensaje</span>
                    </button>
                </div>
            </div>

            {/* User InfoPasajeroProfile component */}
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