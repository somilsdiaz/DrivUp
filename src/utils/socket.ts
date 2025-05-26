import { io, Socket } from 'socket.io-client';

// URL del servidor desde variables de entorno o valor predeterminado
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Crear una instancia compartida de Socket.IO con opciones de reconexión
export const socket: Socket = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionAttempts: 5, 
    reconnectionDelay: 1000,
    timeout: 20000
});

// Añadir listeners globales para debugging
socket.on('connect', () => {
    console.log('Socket conectado globalmente, ID:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Socket desconectado globalmente:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión socket:', error);
});

// Función para unirse a una sala de usuario específica
export const joinUserRoom = (userId: string | number) => {
    if (!userId) return;
    
    const userIdStr = userId.toString();
    console.log(`Uniendo a sala user_${userIdStr}`);
    socket.emit('join_user_room', userIdStr);
};

// Exportar la instancia socket singleton
export default socket; 