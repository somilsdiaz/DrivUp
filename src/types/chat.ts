// Types for chat functionality

import { Socket } from 'socket.io-client';
import { MessageStatus } from "../components/RutasProgramadas/message";

// Interface for API conversation data
export interface ConversationData {
    id: number;
    user_id: number;
    passenger_id: number;
    last_message_at: string;
    user_name: string;
    user_last_name: string;
    passenger_name: string;
    passenger_last_name: string;
    last_message: string;
    unread_count: string;
    last_sender_id?: number;
    is_read?: boolean;
    recipientRole?: string;
}

// Interface for API message data
export interface MessageData {
    id: number;
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    message_text: string;
    is_read: boolean;
    sent_at: string;
    read_at: string | null;
    sender_name: string;
    sender_last_name: string;
}

// Definition for chat messages
export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    fullDate?: Date;
    status?: MessageStatus;
    is_read?: boolean;
}

// Props for the conversation list component
export interface ConversationListProps {
    conversations: ConversationData[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    activeFilter: 'all' | 'unread';
    filteredConversations: ConversationData[];
    selectedChat: number | null;
    onSearchChange: (value: string) => void;
    onFilterChange: (filter: 'all' | 'unread') => void;
    onSelectChat: (id: number) => void;
}

// Props for empty chat state component
export interface EmptyChatStateProps {
    // Any props needed for the empty state display
}

// Props for the chat container
export interface ChatContainerProps {
    selectedChat: number | null;
    selectedChatData: {
        chatId: number;
        recipientName: string;
        recipientImage: string;
        recipientId: number;
        messages: ChatMessage[];
        currentUserId: string;
        recipientRole?: string;
    } | null;
    isLoadingMessages: boolean;
    messagesError: string | null;
    handleSelectChat: (id: number) => void;
    handleMessageSent: (conversationId: number, messageText: string) => void;
    socket: Socket | null;
} 