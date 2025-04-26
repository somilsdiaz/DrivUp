import React, { RefObject } from 'react';
import EmojiPicker from './EmojiPicker';

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    handleSendMessage: () => void;
    isSending: boolean;
    showEmojis: boolean;
    toggleEmojiPicker: () => void;
    inputRef: RefObject<HTMLInputElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    isSending,
    showEmojis,
    toggleEmojiPicker,
    inputRef
}) => {
    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(newMessage + emoji);
    };

    return (
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
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
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
    );
};

export default MessageInput; 