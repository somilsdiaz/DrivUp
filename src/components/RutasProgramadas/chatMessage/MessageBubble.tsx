import React from 'react';
import { motion } from 'framer-motion';
import { Message } from './chatTypes';
import { renderMessageStatus } from './messageUtils';

interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    recipientImage?: string;
    recipientName?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isCurrentUser,
    recipientImage,
    recipientName
}) => {
    return (
        <motion.div 
            key={message._originalId || message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    mass: 1
                }
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            layoutId={message._originalId || message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isCurrentUser && recipientImage && (
                <img 
                    src={recipientImage} 
                    alt={recipientName || 'User'} 
                    className="h-8 w-8 rounded-full object-cover mr-2 self-end mb-1"
                />
            )}
            <motion.div 
                layout
                layoutId={`bubble-${message._originalId || message.id}`}
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                    isCurrentUser 
                        ? 'bg-gradient-to-r from-[#2D5DA1] to-[#2D5DA1]/90 text-white rounded-br-none' 
                        : 'bg-white text-[#4A4E69] rounded-bl-none'
                }`}
            >
                <p className="leading-relaxed">{message.text}</p>
                <motion.div 
                    layout
                    className="flex items-center justify-end mt-1 space-x-1"
                >
                    <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-[#4A4E69]/60'}`}>
                        {message.timestamp}
                    </span>
                    <motion.div layout>
                        {renderMessageStatus(message, isCurrentUser ? message.senderId : '')}
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default MessageBubble; 