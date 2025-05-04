import { FC, useEffect, useState } from "react"
import Message, { MessageStatus } from "../message";
import { ConversationListProps } from "../../../types/chat";
import { getUserId } from "../../../utils/auth";

// Interfaz para la cache de imágenes de perfil
interface ProfileImageCache {
    [userId: number]: string;
}

const ConversationList: FC<ConversationListProps> = ({
    isLoading,
    error,
    searchTerm,
    activeFilter,
    filteredConversations,
    selectedChat,
    onSearchChange,
    onFilterChange,
    onSelectChat
}) => {
    // Estado para almacenar en caché las imágenes de perfil ya cargadas
    const [profileImageCache, setProfileImageCache] = useState<ProfileImageCache>({});
    const defaultImage = '/default-profile.png';
    
    // efecto para actualizar coincidencias en tiempo real en el chat actual
    useEffect(() => {
        if (selectedChat && searchTerm.trim()) {
            // busca coincidencias solo en el chat abierto actualmente
            const currentOpenedChat = filteredConversations.find(
                conv => conv.id === selectedChat
            );
            
            // solo procesa si hay resultados de busqueda en este chat
            if (currentOpenedChat?.highlightedMessage) {
                // limpia datos anteriores de localStorage para evitar conflictos
                localStorage.removeItem('scrollToMessageId');
                localStorage.removeItem('highlightedMessageIds');
                localStorage.removeItem('totalMatches');
                
                // extrae informacion de las coincidencias encontradas
                const matchedIds = currentOpenedChat.highlightedMessage.matchedMessageIds || [];
                const totalMatches = currentOpenedChat.highlightedMessage.totalMatches || 1;
                
                // guarda informacion en localStorage para que el componente de chat la acceda
                localStorage.setItem('scrollToMessageId', currentOpenedChat.highlightedMessage.id || '');
                localStorage.setItem('highlightedMessageIds', JSON.stringify(matchedIds));
                localStorage.setItem('totalMatches', totalMatches.toString());
                
                // notifica al componente de chat que debe resaltar mensajes mediante un evento
                window.dispatchEvent(new CustomEvent('highlightUpdated', {
                    detail: {
                        highlightedMessageId: currentOpenedChat.highlightedMessage.id,
                        matchedMessageIds: matchedIds,
                        totalMatches: totalMatches
                    }
                }));
            }
        }
    }, [searchTerm, filteredConversations, selectedChat]); // se ejecuta cuando cambia la busqueda o el chat seleccionado

    // Función para obtener la imagen de perfil de un usuario
    const getProfileImage = async (userId: number) => {
        // Si ya tenemos la imagen en caché, la usamos
        if (profileImageCache[userId]) {
            return profileImageCache[userId];
        }

        try {
            const profileResponse = await fetch(`http://localhost:5000/usuario/${userId}/foto-perfil`);
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                if (profileData.fotoPerfil) {
                    const imageUrl = `http://localhost:5000/uploads/${profileData.fotoPerfil}`;
                    // Actualizamos la caché con la nueva imagen
                    setProfileImageCache(prev => ({
                        ...prev,
                        [userId]: imageUrl
                    }));
                    return imageUrl;
                }
            }
        } catch (error) {
            console.error('Error al obtener imagen de perfil:', error);
        }
        
        // Si no pudimos obtener la imagen o hubo un error, la agregamos como no disponible en la caché
        if (!profileImageCache[userId]) {
            setProfileImageCache(prev => ({
                ...prev,
                [userId]: defaultImage
            }));
        }
        
        return defaultImage;
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* cabecera con titulo y campo de busqueda */}
            <div className="p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Mensajes
                        </h2>
                        <p className="text-xs text-white/70">Mis conversaciones</p>
                    </div>
                    <div className="flex space-x-2">
                    </div>
                </div>
                {/* campo de busqueda con efecto hover y contador de resultados */}
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
                    {/* muestra contador de resultados cuando hay termino de busqueda */}
                    {searchTerm && (
                        <div className="absolute right-2 top-2.5 text-xs text-white/80 bg-[#5AAA95] px-2 py-0.5 rounded-full">
                            {filteredConversations.length} resultados
                        </div>
                    )}
                </div>
            </div>
            
            {/* barra de filtros para todos/no leidos */}
            <div className="p-2 bg-[#F8F9FA] sticky top-0 z-10 border-b border-[#c0c0c0]">
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
            
            {/* contenedor principal con scroll para lista de conversaciones */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#4A4E69]/10 scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                {/* estados de carga, error o lista de conversaciones */}
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

                    // determina el nombre a mostrar segun quien sea el usuario actual
                    const displayName = isUser
                        ? `${conversation.passenger_name} ${conversation.passenger_last_name}`
                        : `${conversation.user_name} ${conversation.user_last_name}`;

                    // determina id del destinatario segun quien sea el usuario actual
                    const recipientId = isUser
                        ? conversation.passenger_id
                        : conversation.user_id;

                    // verifica si el ultimo mensaje lo envio el usuario actual
                    const isFromCurrentUser = conversation.last_sender_id !== undefined ?
                        conversation.last_sender_id.toString() === currentUserId :
                        false;

                    // configura estado del mensaje segun si fue leido o no
                    let messageStatus: MessageStatus = 'sent';
                    if (isFromCurrentUser) {
                        messageStatus = conversation.is_read === true ? 'read' : 'delivered';
                    }
                    
                    // prepara datos para mostrar mensaje destacado si hay busqueda activa
                    let lastMessageText = conversation.last_message;
                    let isHighlighted = false;
                    let highlightedMessageId = undefined;
                    let totalMatches = 0;
                    let matchedMessageIds = undefined;
                    
                    if (conversation.highlightedMessage) {
                        lastMessageText = conversation.highlightedMessage.text;
                        isHighlighted = true;
                        highlightedMessageId = conversation.highlightedMessage.id;
                        totalMatches = conversation.highlightedMessage.totalMatches || 1;
                        matchedMessageIds = conversation.highlightedMessage.matchedMessageIds;
                    }

                    // Intentar cargar la imagen de perfil para este chat
                    if (!profileImageCache[recipientId]) {
                        // Llamar al servicio en segundo plano para obtener la imagen
                        getProfileImage(recipientId);
                    }

                    // Usar la imagen en caché o la imagen por defecto
                    const profileImage = profileImageCache[recipientId] || defaultImage;

                    // renderiza cada item de conversacion con el componente Message
                    return (
                        <Message
                            key={conversation.id}
                            id={conversation.id.toString()}
                            senderName={displayName}
                            profileImage={profileImage}
                            lastMessage={lastMessageText}
                            timestamp={new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            isRead={parseInt(conversation.unread_count) === 0}
                            messageStatus={messageStatus}
                            isFromCurrentUser={isFromCurrentUser}
                            recipientRole={conversation.recipientRole}
                            isHighlighted={isHighlighted}
                            highlightedMessageId={highlightedMessageId}
                            totalMatches={totalMatches}
                            matchedMessageIds={matchedMessageIds}
                            onSelect={(id) => onSelectChat(parseInt(id))}
                        />
                    );
                }) : (
                    // mensaje cuando no hay resultados
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