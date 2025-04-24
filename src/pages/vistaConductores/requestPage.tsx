import { useState, useEffect, FC } from "react"
import HeaderFooter from "../../layouts/headerFooterConductores";
import Message from "../../components/RutasProgramadas/message";
import ChatMessage from "../../components/RutasProgramadas/chatMessage";
import { motion } from 'framer-motion';
import { getUserId } from "../../utils/auth";

// Interface for API conversation data
interface ConversationData {
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
}

// Definición de tipo para los mensajes de chat
interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

const RequestPage: FC = () => {
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [selectedChatData, setSelectedChatData] = useState<{
        chatId: number;
        recipientName: string;
        recipientImage: string;
        messages: ChatMessage[];
        currentUserId: string;
    } | null>(null);

    // Estado para filtrar mensajes
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConversations, setFilteredConversations] = useState<ConversationData[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            setError(null);
            
            const userId = getUserId();
            
            if (!userId) {
                setError("No user ID found. Please log in again.");
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:5000/conversations/${userId}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch conversations: ${response.status}`);
                }
                
                const data = await response.json();
                setConversations(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
                setIsLoading(false);
            }
        };
        
        fetchConversations();
    }, []);

    // Handle chat selection
    const handleSelectChat = (id: number) => {
        setSelectedChat(id);
        const selectedConversation = conversations.find(conv => conv.id === id);
        
        if (selectedConversation) {
            // For now, we'll use empty messages until we implement fetching chat messages
            setSelectedChatData({
                chatId: id,
                recipientName: `${selectedConversation.passenger_name} ${selectedConversation.passenger_last_name}`,
                recipientImage: '/Somil_profile.webp', // Default image until we have real profile images
                messages: [], // This will be populated when we implement message fetching
                currentUserId: getUserId() || ''
            });
            
            // TODO: Fetch actual messages for this conversation
        }
    };

    // Filter conversations when search term or filter changes
    useEffect(() => {
        let filtered = conversations;
        
        // Apply unread filter
        if (activeFilter === 'unread') {
            filtered = filtered.filter(conversation => parseInt(conversation.unread_count) > 0);
        }
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(conversation => 
                `${conversation.passenger_name} ${conversation.passenger_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                conversation.last_message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredConversations(filtered);
    }, [searchTerm, activeFilter, conversations]);

    return (
        <main className="h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
            <HeaderFooter>
                <div className="container mx-auto py-6 px-4 h-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4"
                    >
                        <h1 className="text-3xl font-bold text-[#0a0d35] mb-2">Solicitudes de viaje</h1>
                        <p className="text-[#4A4E69]/80 max-w-2xl">Utiliza el chat para comunicarte con los pasajeros que solicitan rutas programadas y establece de forma clara los términos del viaje.</p>
                    </motion.div>
                    
                    <div className="flex h-full] bg-white rounded-xl shadow-xl overflow-hidden border border-[#4A4E69]/10 transition-all duration-300 hover:shadow-2xl">
                        {/* Lista de mensajes (izquierda) */}
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
                                        <p className="text-xs text-white/70">Conversaciones con pasajeros</p>
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
                                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                                onClick={() => setActiveFilter('all')}
                                            >
                                                Todos
                                            </button>
                                            <button 
                                                className={`text-xs px-2 py-1 rounded ${activeFilter === 'unread' ? 'bg-white text-[#4A4E69] border border-[#4A4E69]/20' : 'text-[#4A4E69]/60 hover:bg-white'} transition-colors`}
                                                onClick={() => setActiveFilter('unread')}
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
                                ) : filteredConversations.length > 0 ? filteredConversations.map((conversation) => (
                                    <Message
                                        key={conversation.id}
                                        id={conversation.id.toString()}
                                        senderName={`${conversation.passenger_name} ${conversation.passenger_last_name}`}
                                        profileImage="/Somil_profile.webp"
                                        lastMessage={conversation.last_message}
                                        timestamp={new Date(conversation.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        isRead={parseInt(conversation.unread_count) === 0}
                                        onSelect={(id) => handleSelectChat(parseInt(id))}
                                    />
                                )) : (
                                    <div className="p-6 text-center text-[#4A4E69]/70">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-[#4A4E69]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <p>No se encontraron mensajes</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Área de chat (derecha) */}
                        <div className="w-2/3 flex flex-col bg-[#F8F9FA] relative">
                            {selectedChat ? (
                                <ChatMessage
                                    chatId={selectedChatData?.chatId.toString() || ''}
                                    recipientName={selectedChatData?.recipientName || ''}
                                    recipientImage={selectedChatData?.recipientImage || ''}
                                    messages={selectedChatData?.messages || []}
                                    currentUserId={selectedChatData?.currentUserId || ''}
                                />
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm"
                                >
                                    <div className="text-center p-8 max-w-md">
                                        <div className="w-32 h-32 bg-gradient-to-br from-[#2D5DA1]/20 to-[#5AAA95]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#2D5DA1]/0 to-[#5AAA95]/0 group-hover:from-[#2D5DA1]/10 group-hover:to-[#5AAA95]/10 transition-all duration-500"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#2D5DA1] transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#0a0d35] mb-3">Centro de Mensajes</h3>
                                        <p className="text-[#4A4E69]/80 mb-4 max-w-xs mx-auto">Selecciona un chat para ver la conversación completa y responder a tus mensajes.</p>
                                        <div className="flex flex-col space-y-3 mb-8">
                                            <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Respuesta rápida a pasajeros
                                            </div>
                                            <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Historial de conversaciones
                                            </div>
                                            <div className="flex items-center justify-center text-[#4A4E69]/70 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Notificaciones en tiempo real
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </HeaderFooter>
        </main>
    );
}

export default RequestPage;