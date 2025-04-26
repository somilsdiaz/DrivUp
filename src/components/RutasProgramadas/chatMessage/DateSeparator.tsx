import React from 'react';
import { motion } from 'framer-motion';
import { DateSeparator as DateSeparatorType } from './chatTypes';

interface DateSeparatorProps {
    separator: DateSeparatorType;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ separator }) => {
    return (
        <motion.div 
            key={`sep-${separator.date}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center my-4"
        >
            <span className="inline-block px-3 py-1 text-xs bg-white text-[#4A4E69]/70 rounded-full shadow-sm border border-[#4A4E69]/10">
                {separator.label}
            </span>
        </motion.div>
    );
};

export default DateSeparator; 