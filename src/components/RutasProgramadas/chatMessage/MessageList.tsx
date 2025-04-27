import React, { RefObject } from 'react';
import { Message } from './chatTypes';
import MessageBubble from './MessageBubble';
import DateSeparator from './DateSeparator';
import { processMessagesWithDateSeparators } from './messageUtils';

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
    // Renderizar los mensajes junto con los separadores de fecha
    const renderMessagesWithSeparators = () => {
        const processedMessages = processMessagesWithDateSeparators(messages);
        
        // Get current highlighted message ID - will change when highlightedMessageChanged updates
        const currentHighlightedMessageId = localStorage.getItem('scrollToMessageId');
        const highlightedIds = localStorage.getItem('highlightedMessageIds');
        
        // Parse all highlighted message IDs if available
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
        
        // Determine the ID of the last real message for highlighting if needed
        const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
        
        // If 'last' is in the matched IDs and we have messages, replace it with the actual last message ID
        if (matchedMessageIds.includes('last') && lastMessageId) {
            // Replace 'last' with the actual ID
            matchedMessageIds = matchedMessageIds.map(id => id === 'last' ? lastMessageId : id);
        }
        
        return processedMessages.map((item) => {
            if ('isSeparator' in item) {
                return <DateSeparator key={`separator-${item.date}`} separator={item} />;
            }

            const isFromCurrentUser = item.senderId === currentUserId;
            
            // Check if this message ID is in the list of highlighted messages
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

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
            {renderMessagesWithSeparators()}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 