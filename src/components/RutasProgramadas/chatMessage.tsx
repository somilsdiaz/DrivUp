import React, { useState, useEffect, useRef } from 'react';
import InfoPasajeroProfile from './infoPasajeroProfile';
import { motion } from 'framer-motion';
import { Message, ChatMessageProps } from './chatMessage/chatTypes';
import ChatHeader from './chatMessage/ChatHeader';
import MessageList from './chatMessage/MessageList';
import MessageInput from './chatMessage/MessageInput';
import ErrorMessage from './chatMessage/ErrorMessage';

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
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    // variable para controlar si debemos hacer scroll al último mensaje
    const [preventAutoScroll, setPreventAutoScroll] = useState(false);
    // Add a state to track localStorage changes for highlighted messages
    const [highlightedMessageChanged, setHighlightedMessageChanged] = useState(0);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const firstRenderRef = useRef(true);

    // Listen for localStorage changes that affect highlights
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'scrollToMessageId' || e.key === 'highlightedMessageIds' || e.key === 'totalMatches') {
                console.log('ChatMessage: Detected localStorage change for highlights', e.key);
                // Trigger a re-render by updating the state
                setHighlightedMessageChanged(prev => prev + 1);
            }
        };
        
        // Custom event handler for highlight updates
        const handleHighlightUpdated = (e: CustomEvent) => {
            console.log('ChatMessage: Received highlightUpdated event', e.detail);
            setHighlightedMessageChanged(prev => prev + 1);
        };
        
        // Listen for storage events (for multi-tab support)
        window.addEventListener('storage', handleStorageChange);
        // Listen for our custom highlight event 
        window.addEventListener('highlightUpdated', handleHighlightUpdated as EventListener);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('highlightUpdated', handleHighlightUpdated as EventListener);
        };
    }, []);

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

        // Handle new messages - Needed to properly update read status in real-time
        const handleNewMessage = (message: any) => {
            // Only handle messages for the current chat and from other users
            if (parseInt(chatId) === message.conversation_id && 
                message.sender_id.toString() !== currentUserId) {
                
                console.log('ChatMessage: New message received in current chat, marking as read');
                
                // Mark as read immediately since the user is viewing this chat
                socket.emit('mark_as_read', {
                    conversationId: parseInt(chatId),
                    userId: parseInt(currentUserId)
                });
                
                // No need to update the local messages as the parent component (chatPage) 
                // will handle adding the new message to the chat
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
        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('message_sent', handleMessageSent);
            socket.off('message_error', handleMessageError);
            socket.off('messages_read', handleMessagesRead);
            socket.off('new_message', handleNewMessage);
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
        // or enable it if we're switching to a chat without highlighted messages
        setPreventAutoScroll(hasHighlightedMessage);
        
        // Clean up highlighted elements when component unmounts or chatId changes
        return () => {
            document.querySelectorAll('[data-highlighted="true"]').forEach(el => {
                el.classList.remove('bg-[#F2B134]/10', 'bg-[#F2B134]/20');
                el.removeAttribute('data-highlighted');
            });
        };
    }, [chatId, messages]);

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
        
        // To help with debugging
        if (scrollToMessageId) {
            console.log(`ChatMessage: Processing highlighted messages for chat ${chatId}. Target message ID: ${scrollToMessageId}`);
        }
        
        // Clear any previous highlighted elements when the effect runs again
        // Instead of trying to select by the Tailwind classes directly, 
        // we'll use a more reliable approach to find elements
        document.querySelectorAll('[data-highlighted="true"]').forEach(el => {
            el.classList.remove('bg-[#F2B134]/10', 'bg-[#F2B134]/20');
            el.removeAttribute('data-highlighted');
        });
        
        if (scrollToMessageId) {
            console.log("Intentando hacer scroll a mensajes coincidentes:", scrollToMessageId);
            
            // activamos la prevención de scroll automático
            setPreventAutoScroll(true);
            
            // obtenemos la lista de todos los mensajes a resaltar
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
            
            // If the scrollToMessageId is 'last', we need to determine if this is the only ID or if there are others
            // We'll map all actual message IDs and keep the special 'last' ID only until we have message data
            let hasLastMessageId = idsToHighlight.includes('last');
            
            // Filter out the 'last' ID and map real message IDs
            let actualIdsToHighlight = idsToHighlight
                .filter(id => id !== 'last')
                .map(id => id); // Clone the array
            
            // If we have 'last' in the original list and we have messages, map it to the actual last message ID
            if (hasLastMessageId && localMessages.length > 0) {
                const lastMessageId = localMessages[localMessages.length - 1].id;
                actualIdsToHighlight.push(lastMessageId);
                console.log("Mapped 'last' ID to actual last message ID:", lastMessageId);
            }
            
            // If we're highlighting the last message but don't have message data yet
            if (hasLastMessageId && actualIdsToHighlight.length === 0) {
                console.log("Waiting for messages to load before highlighting last message");
                setTimeout(() => {
                    // Trigger a re-render to check again once messages are loaded
                    setHighlightedMessageChanged(prev => prev + 1);
                }, 500);
                return;
            }
            
            // esperamos a que el DOM se actualice
            setTimeout(() => {
                // resaltamos todos los mensajes encontrados
                let foundAnyMessage = false;
                let primaryMessageElement: HTMLElement | null = null;
                
                console.log("Trying to highlight messages with IDs:", actualIdsToHighlight);
                
                // procesar cada ID de mensaje coincidente
                actualIdsToHighlight.forEach((msgId, index) => {
                    const messageElement = document.getElementById(`message-${msgId}`);
                    if (messageElement) {
                        foundAnyMessage = true;
                        // guardamos el primer elemento para hacer scroll hacia él
                        if (index === 0) {
                            primaryMessageElement = messageElement;
                        }
                        
                        // resaltamos todos los mensajes coincidentes
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
                }
                
                if (!foundAnyMessage) {
                    console.log("Ningún mensaje destacado encontrado en el DOM");
                    // si no encontramos mensajes, permitimos scroll normal
                    setPreventAutoScroll(false);
                }
                
                // limpiamos después de usar, pero solo si no estamos resaltando el último mensaje
                // para el último mensaje, necesitamos mantener la información para seguir resaltándolo
                if (!(scrollToMessageId === 'last' && foundAnyMessage)) {
                    localStorage.removeItem('scrollToMessageId');
                    localStorage.removeItem('highlightedMessageIds');
                    localStorage.removeItem('totalMatches');
                }
            }, 300);
        }
    }, [messages, chatId, highlightedMessageChanged, localMessages]);

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
        
        // After sending a message, enable auto-scroll to show the new message
        // This helps if the user was previously viewing highlighted messages
        setPreventAutoScroll(false);
        
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* Chat header */}
            <ChatHeader 
                recipientName={recipientName}
                recipientImage={recipientImage}
                toggleInfoModal={toggleInfoModal}
                onBackToList={onBackToList}
                showBackButton={showBackButton}
            />

            {/* Message area */}
            <MessageList 
                messages={localMessages}
                currentUserId={currentUserId}
                recipientName={recipientName}
                recipientImage={recipientImage}
                messagesEndRef={messagesEndRef}
                highlightedMessageChanged={highlightedMessageChanged}
            />
            
            {/* Error message */}
            {sendError && (
                <ErrorMessage 
                    error={sendError} 
                    onClose={() => setSendError(null)} 
                />
            )}

            {/* Message input area */}
            <MessageInput 
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isSending={isSending}
                showEmojis={showEmojis}
                toggleEmojiPicker={toggleEmojiPicker}
                inputRef={inputRef}
            />

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