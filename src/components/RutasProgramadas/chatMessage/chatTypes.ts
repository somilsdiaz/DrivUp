import { Socket } from 'socket.io-client';
import { MessageStatus } from '../message';

// interfaz para mensajes de chat
export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    status?: MessageStatus;
    _originalId?: string; // id original para mantener animaciones
    fullDate?: Date; // fecha completa para agrupar por dias
}

// props para el componente de chat
export interface ChatMessageProps {
    chatId: string;
    recipientName: string;
    recipientImage: string;
    recipientId: number;
    messages: Message[];
    currentUserId: string;
    onMessageSent: (conversationId: number, messageText: string) => void;
    socket: Socket | null;
    onBackToList?: () => void;
    showBackButton?: boolean;
}

// interfaz para separadores de fecha en la lista de mensajes
export interface DateSeparator {
    isSeparator: true;
    label: string;
    date: string;
}

// tipo union para manejar mensajes y separadores
export type MessageOrSeparator = Message | DateSeparator; 