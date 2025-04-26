import { Message, MessageOrSeparator } from './chatTypes';

// Render message status indicators
export const renderMessageStatus = (message: Message, currentUserId: string) => {
    if (message.senderId !== currentUserId) return null;
    
    switch (message.status) {
        case 'read':
            return (
                <div className="flex items-center space-x-1">
                    <div className="flex relative transform scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#5AAA95] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 text-[#5AAA95] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            );
        case 'delivered':
            return (
                <div className="flex items-center space-x-1">
                    <div className="flex relative transform scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#F2B134] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 text-[#F2B134] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            );
        case 'sent':
            return (
                <div className="flex items-center space-x-1">
                    <div className="relative transform scale-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#4A4E69]/70 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

// Function to get date label (Today, Yesterday, or formatted date)
export const getDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    
    if (messageDate.getTime() === today.getTime()) {
        return "Hoy";
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return "Ayer";
    } else {
        return messageDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Process messages and add date separators
export const processMessagesWithDateSeparators = (messages: Message[]): MessageOrSeparator[] => {
    if (!messages || messages.length === 0) return [];
    
    // Convert timestamp strings to Date objects
    const messagesWithDates = messages.map(msg => {
        // Try to extract the date from timestamp
        let fullDate;
        if (msg.timestamp.includes('/')) {
            // Format with full date: "dd/mm/yyyy, hh:mm"
            const parts = msg.timestamp.split(', ');
            const dateParts = parts[0].split('/');
            if (dateParts.length === 3) {
                fullDate = new Date(
                    parseInt(dateParts[2]), // year
                    parseInt(dateParts[1]) - 1, // month (0-11)
                    parseInt(dateParts[0]) // day
                );
            } else {
                fullDate = new Date(); // In case of error, use current date
            }
        } else {
            // Simple format "hh:mm" - assume current date
            fullDate = new Date();
        }
        
        return {
            ...msg,
            fullDate
        };
    });
    
    // Sort messages by date (oldest first)
    messagesWithDates.sort((a, b) => {
        if (a.id.startsWith('temp-') && !b.id.startsWith('temp-')) return 1;
        if (!a.id.startsWith('temp-') && b.id.startsWith('temp-')) return -1;
        
        const dateA = a.fullDate || new Date();
        const dateB = b.fullDate || new Date();
        return dateA.getTime() - dateB.getTime();
    });
    
    // Group messages by day
    const groupedByDate: { [key: string]: Message[] } = {};
    
    messagesWithDates.forEach(msg => {
        const date = msg.fullDate || new Date();
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!groupedByDate[dateString]) {
            groupedByDate[dateString] = [];
        }
        
        groupedByDate[dateString].push(msg);
    });
    
    // Create an array with date separators
    const result: MessageOrSeparator[] = [];
    
    // Sort dates (oldest first)
    const sortedDates = Object.keys(groupedByDate).sort();
    
    sortedDates.forEach(dateString => {
        // Add the separator
        const firstMessage = groupedByDate[dateString][0];
        const date = firstMessage.fullDate || new Date();
        const label = getDateLabel(date);
        
        result.push({ 
            isSeparator: true, 
            label, 
            date: dateString 
        });
        
        // Add the messages for that day
        result.push(...groupedByDate[dateString]);
    });
    
    return result;
}; 