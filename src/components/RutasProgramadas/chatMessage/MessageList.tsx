import React, { RefObject } from 'react';
import { Message } from './chatTypes';
import MessageBubble from './MessageBubble';
import DateSeparator from './DateSeparator';
import { processMessagesWithDateSeparators } from './messageUtils';

// interfaz que define las propiedades del componente de lista de mensajes
interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    recipientName: string;
    recipientImage: string;
    messagesEndRef: RefObject<HTMLDivElement>;
    highlightedMessageChanged: number;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    recipientName,
    recipientImage,
    messagesEndRef,
    highlightedMessageChanged
}) => {
    // función para renderizar mensajes con separadores de fecha
    const renderMessagesWithSeparators = () => {
        // procesa los mensajes para añadir separadores de fecha
        const processedMessages = processMessagesWithDateSeparators(messages);
        
        // obtiene el id del mensaje destacado actual
        const currentHighlightedMessageId = localStorage.getItem('scrollToMessageId');
        const highlightedIds = localStorage.getItem('highlightedMessageIds');
        
        // analiza todos los ids de mensajes destacados si están disponibles
        let matchedMessageIds: string[] = [];
        if (highlightedIds) {
            try {
                matchedMessageIds = JSON.parse(highlightedIds);
            } catch (e) {
                console.error("Error parsing highlighted IDs:", e);
                if (currentHighlightedMessageId) {
                    matchedMessageIds = [currentHighlightedMessageId];
                }
            }
        } else if (currentHighlightedMessageId) {
            matchedMessageIds = [currentHighlightedMessageId];
        }
        
        console.log(`Rendering messages, highlighted IDs:`, matchedMessageIds, `change count: ${highlightedMessageChanged}`);
        
        // determina el id del último mensaje real para destacarlo si es necesario
        const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
        
        // si 'last' está en los ids coincidentes y tenemos mensajes, lo reemplaza con el id del último mensaje real
        if (matchedMessageIds.includes('last') && lastMessageId) {
            matchedMessageIds = matchedMessageIds.map(id => id === 'last' ? lastMessageId : id);
        }
        
        // mapea y renderiza cada elemento (mensajes o separadores)
        return processedMessages.map((item) => {
            if ('isSeparator' in item) {
                return <DateSeparator key={`separator-${item.date}`} separator={item} />;
            }

            const isFromCurrentUser = item.senderId === currentUserId;
            
            // verifica si este mensaje debe ser destacado
            const isHighlightedMessage = matchedMessageIds.includes(item.id);
            
            return (
                <div 
                    id={`message-${item.id}`} 
                    key={item._originalId || item.id}
                    className={isHighlightedMessage ? 'scroll-mt-8' : ''}
                    data-highlighted={isHighlightedMessage ? 'true' : undefined}
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

    // contenedor principal con estilos y referencia para desplazamiento automático
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
            {renderMessagesWithSeparators()}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 