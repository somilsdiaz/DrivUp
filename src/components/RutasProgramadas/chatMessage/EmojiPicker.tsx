import React from 'react';

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
    const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '😎', '🔥', '🎉', '👋', '😢', '🤔'];
    
    return (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl p-2 border border-gray-200 grid grid-cols-6 gap-1 w-64">
            {emojis.map(emoji => (
                <button 
                    key={emoji} 
                    className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => onEmojiSelect(emoji)}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default EmojiPicker; 