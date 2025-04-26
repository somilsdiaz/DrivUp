import { FC } from 'react';
import { ChatContainerProps } from '../../../types/chat';
import ChatMessage from '../chatMessage';
import EmptyChatState from './EmptyChatState';

const ChatContainer: FC<ChatContainerProps> = ({
    selectedChat,
    selectedChatData,
    isLoadingMessages,
    messagesError,
    handleSelectChat,
    handleMessageSent,
    socket
}) => {
    if (!selectedChat) {
        return <EmptyChatState />;
    }

    return (
        <>
            {isLoadingMessages && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2D5DA1] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p className="mt-2 text-[#4A4E69]">Cargando mensajes...</p>
                    </div>
                </div>
            )}
            {messagesError && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-w-md">
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-red-800 font-medium">Error al cargar mensajes</h3>
                                <p className="text-red-700 text-sm mt-1">{messagesError}</p>
                                <button
                                    className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-md text-sm transition-colors"
                                    onClick={() => handleSelectChat(selectedChat)}
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ChatMessage
                chatId={selectedChatData?.chatId.toString() || ''}
                recipientName={selectedChatData?.recipientName || ''}
                recipientImage={selectedChatData?.recipientImage || ''}
                recipientId={selectedChatData?.recipientId || 0}
                messages={selectedChatData?.messages || []}
                currentUserId={selectedChatData?.currentUserId || ''}
                onMessageSent={handleMessageSent}
                socket={socket}
            />
        </>
    );
};

export default ChatContainer; 