import React, { useState, useEffect, FC } from "react"
import HeaderFooter from "../../layouts/headerFooterConductores";
import Message from "../../components/RutasProgramadas/message";
import ChatMessage from "../../components/RutasProgramadas/chatMessage";
import { motion } from 'framer-motion';

// Datos de ejemplo para la demostración
const mockMessages = [
    {
        id: '1',
        senderName: 'Carlos Rodríguez',
        profileImage: '/Somil_profile.webp',
        lastMessage: '¿A qué hora llegarás a la estación?',
        timestamp: '10:30',
        isRead: false
    },
    {
        id: '2',
        senderName: 'María López',
        profileImage: '/Somil_profile.webp',
        lastMessage: 'Gracias por el viaje de hoy',
        timestamp: '09:15',
        isRead: true
    },
    {
        id: '3',
        senderName: 'Juan Pérez',
        profileImage: '/Somil_profile.webp',
        lastMessage: '¿Puedes recogerme mañana?',
        timestamp: 'Ayer',
        isRead: true
    },
    {
        id: '4',
        senderName: 'Ana Gómez',
        profileImage: '/Somil_profile.webp',
        lastMessage: 'Confirma la ruta por favor',
        timestamp: 'Ayer',
        isRead: false
    },
    {
        id: '45',
        senderName: 'Ana Gómez',
        profileImage: '/Somil_profile.webp',
        lastMessage: 'Confirma la ruta por favor',
        timestamp: 'Ayer',
        isRead: false
    },
    {
        id: '45',
        senderName: 'Ana Gómez',
        profileImage: '/Somil_profile.webp',
        lastMessage: 'Confirma la ruta por favor',
        timestamp: 'Ayer',
        isRead: false
    }
];

// Definición de tipo para los mensajes de chat
interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

// Definición de tipo para el objeto mockChatMessages con índice de tipo string
type ChatMessagesRecord = Record<string, ChatMessage[]>;

const mockChatMessages: ChatMessagesRecord = {
    '1': [
        { id: 'c1', senderId: 'user123', text: 'Hola, ¿cómo estás?', timestamp: '10:25' },
        { id: 'c2', senderId: '1', text: '¿A qué hora llegarás a la estación?', timestamp: '10:30' },
    ],
    '2': [
        { id: 'c3', senderId: 'user123', text: 'El viaje estuvo muy bien', timestamp: '09:10' },
        { id: 'c4', senderId: '2', text: 'Gracias por el viaje de hoy', timestamp: '09:15' },
    ],
    '3': [
        { id: 'c5', senderId: '3', text: '¿Puedes recogerme mañana?', timestamp: 'Ayer 18:45' },
    ],
    '4': [
        { id: 'c6', senderId: '4', text: 'Confirma la ruta por favor', timestamp: 'Ayer 20:30' },
    ]
};

const RequestPage: FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [selectedChatData, setSelectedChatData] = useState<{
        chatId: string;
        recipientName: string;
        recipientImage: string;
        messages: ChatMessage[];
        currentUserId: string;
    } | null>(null);

    const handleSelectChat = (id: string) => {
        setSelectedChat(id);
        const selectedMessage = mockMessages.find(msg => msg.id === id);
        if (selectedMessage) {
            setSelectedChatData({
                chatId: id,
                recipientName: selectedMessage.senderName,
                recipientImage: selectedMessage.profileImage,
                messages: mockChatMessages[id] || [],
                currentUserId: 'user123'
            });
        }
    };

    // Estado para filtrar mensajes
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMessages, setFilteredMessages] = useState(mockMessages);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    // Filtrar mensajes cuando cambia el término de búsqueda o el filtro activo
    useEffect(() => {
        let filtered = mockMessages;
        
        // Aplicar filtro por estado de lectura
        if (activeFilter === 'unread') {
            filtered = filtered.filter(message => !message.isRead);
        }
        
        // Aplicar filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(message => 
                message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredMessages(filtered);
    }, [searchTerm, activeFilter, mockMessages]);

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
                        <div className="w-1/3 border-r overflow-y-auto relative">
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
                                        <button className="p-1.5 rounded-full bg-[#2D5DA1]/20 text-white hover:bg-[#2D5DA1]/40 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        <button className="p-1.5 rounded-full bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/80 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
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
                                            {filteredMessages.length} resultados
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="divide-y divide-[#4A4E69]/10">
                                <div className="p-2 bg-[#F8F9FA] sticky top-[73px] z-10 border-b">
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
                                {filteredMessages.length > 0 ? filteredMessages.map((message) => (
                                    <Message
                                        key={message.id}
                                        id={message.id}
                                        senderName={message.senderName}
                                        profileImage={message.profileImage}
                                        lastMessage={message.lastMessage}
                                        timestamp={message.timestamp}
                                        isRead={message.isRead}
                                        onSelect={handleSelectChat}
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
                                    chatId={selectedChatData?.chatId || ''}
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