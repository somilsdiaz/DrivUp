import { Socket } from 'socket.io-client';
import { MessageStatus } from '../message';

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    status?: MessageStatus;
    _originalId?: string;
    fullDate?: Date;
}

export interface ChatMessageProps {
    chatId: string;
    recipientName: string;
    recipientImage: string;
    recipientId: number;
    messages: Message[];
    currentUserId: string;
    onMessageSent: (conversationId: number, messageText: string) => void;
    socket: Socket | null;
}

export interface DateSeparator {
    isSeparator: true;
    label: string;
    date: string;
}

export type MessageOrSeparator = Message | DateSeparator; 