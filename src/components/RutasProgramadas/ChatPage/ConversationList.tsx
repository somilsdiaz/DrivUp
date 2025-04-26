import { FC } from "react"
import Message, { MessageStatus } from "../message";
import { ConversationListProps } from "../../../types/chat";
import { getUserId } from "../../../utils/auth";

const ConversationList: FC<ConversationListProps> = ({
    isLoading,
    error,
    searchTerm,
    activeFilter,
    filteredConversations,
    onSearchChange,
    onFilterChange,
    onSelectChat
}) => {
    return (
        <div className="w-1/3 border-r overflow-hidden relative flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Mensajes
                        </h2>
                        <p className="text-xs text-white/70">Mis conversaciones</p>
                    </div>
                    <div className="flex space-x-2">
                    </div>
                </div>
                <div className="mt-3 relative">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Buscar mensajes..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#2D5DA1]/20 text-white placeholder-white/60 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AAA95] transition-all duration-300 group-hover:bg-[#2D5DA1]/30"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-3 transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {searchTerm && (
                        <div className="absolute right-2 top-2.5 text-xs text-white/80 bg-[#5AAA95] px-2 py-0.5 rounded-full">
                            {filteredConversations.length} resultados
                        </div>
                    )}
                </div>
            </div>
            <div className="divide-y divide-[#4A4E69]/10 overflow-y-auto max-h-[calc(100vh-240px)] flex-1 scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                <div className="p-2 bg-[#F8F9FA] sticky top-0 z-10 border-b">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-medium text-[#4A4E69]">Conversaciones recientes</h3>
                        <div className="flex space-x-1">
                            <button
                                className={`text-xs px-2 py-1 rounded ${activeFilter === 'all' ? 'bg-white text-[#4A4E69] border border-[#4A4E69]/20' : 'text-[#4A4E69]/60 hover:bg-white'} transition-colors`}
                                onClick={() => onFilterChange('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`text-xs px-2 py-1 rounded ${activeFilter === 'unread' ? 'bg-white text-[#4A4E69] border border-[#4A4E69]/20' : 'text-[#4A4E69]/60 hover:bg-white'} transition-colors`}
                                onClick={() => onFilterChange('unread')}
                            >
                                No leídos
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-6 text-center text-[#4A4E69]/70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-[#4A4E69]/30 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p>Cargando conversaciones...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                ) : filteredConversations.length > 0 ? filteredConversations.map((conversation) => {
                    const currentUserId = getUserId() || '';
                    const isUser = currentUserId === conversation.user_id.toString();

                    // Determine the correct name to display based on who the current user is
                    const displayName = isUser
                        ? `${conversation.passenger_name} ${conversation.passenger_last_name}`
                        : `${conversation.user_name} ${conversation.user_last_name}`;

                    // Determine if the last message is from the current user
                    const isFromCurrentUser = conversation.last_sender_id !== undefined ?
                        conversation.last_sender_id.toString() === currentUserId :
                        false;

                    // Determine message status based on read status
                    let messageStatus: MessageStatus = 'sent';
                    if (isFromCurrentUser) {
                        messageStatus = conversation.is_read === true ? 'read' : 'delivered';
                    }
                    
                    // Si hay un mensaje destacado por búsqueda, lo usamos en lugar del último mensaje
                    let lastMessageText = conversation.last_message;
                    let isHighlighted = false;
                    
                    if (conversation.highlightedMessage) {
                        lastMessageText = conversation.highlightedMessage.text;
                        isHighlighted = true;
                    }

                    return (
                        <Message
                            key={conversation.id}
                            id={conversation.id.toString()}
                            senderName={displayName}
                            profileImage="/Somil_profile.webp"
                            lastMessage={lastMessageText}
                            timestamp={new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            isRead={parseInt(conversation.unread_count) === 0}
                            messageStatus={messageStatus}
                            isFromCurrentUser={isFromCurrentUser}
                            recipientRole={conversation.recipientRole}
                            isHighlighted={isHighlighted}
                            highlightedMessageId={conversation.highlightedMessage?.id}
                            onSelect={(id) => onSelectChat(parseInt(id))}
                        />
                    );
                }) : (
                    <div className="p-6 text-center text-[#4A4E69]/70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-[#4A4E69]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>No se encontraron mensajes</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList; 