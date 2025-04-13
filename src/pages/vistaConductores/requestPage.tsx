import React, { useState, useEffect } from "react"
import HeaderFooter from "../../layouts/headerFooterConductores";
import Message from "../../components/RutasProgramadas/message";
import ChatMessage from "../../components/RutasProgramadas/chatMessage";

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

const RequestPage: React.FC = () => {
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

    // Filtrar mensajes cuando cambia el término de búsqueda
    useEffect(() => {
        const filtered = mockMessages.filter(message => 
            message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMessages(filtered);
    }, [searchTerm]);

    return (
        <main className="h-screen bg-[#F8F9FA]">
            <HeaderFooter>
                <div className="container mx-auto py-6 px-4 h-full">
                    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-xl overflow-hidden border border-[#4A4E69]/10">
                        {/* Lista de mensajes (izquierda) */}
                        <div className="w-1/3 border-r overflow-y-auto">
                            <div className="p-4 border-b bg-[#0a0d35] sticky top-0 z-10">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white">Mensajes</h2>
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
                                    <input 
                                        type="text" 
                                        placeholder="Buscar mensajes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#2D5DA1]/20 text-white placeholder-white/60 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AAA95]"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="divide-y divide-[#4A4E69]/10">
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
                        <div className="w-2/3 flex flex-col bg-[#F8F9FA]">
                            {selectedChat ? (
                                <ChatMessage
                                    chatId={selectedChatData?.chatId || ''}
                                    recipientName={selectedChatData?.recipientName || ''}
                                    recipientImage={selectedChatData?.recipientImage || ''}
                                    messages={selectedChatData?.messages || []}
                                    currentUserId={selectedChatData?.currentUserId || ''}
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA]">
                                    <div className="text-center p-8 max-w-md">
                                        <div className="w-28 h-28 bg-[#2D5DA1]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-medium text-[#4A4E69] mb-3">Tus mensajes</h3>
                                        <p className="text-[#4A4E69]/70 mb-8 max-w-xs mx-auto">Selecciona un chat para ver la conversación completa y responder a tus mensajes.</p>
                                        <button className="bg-[#2D5DA1] text-white px-6 py-2.5 rounded-lg hover:bg-[#2D5DA1]/90 transition-colors shadow-md flex items-center mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Nuevo mensaje
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </HeaderFooter>
        </main>
    );
}

export default RequestPage;