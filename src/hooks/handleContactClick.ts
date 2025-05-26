import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/auth";

type ContactClickProps={
    driverId:number,
    setError: (errorMessage: string) => void,
    setIdNumber?:(index:number)=>void
    navigate: ReturnType<typeof useNavigate>
}

const handleContactClick = async ({driverId,setError,setIdNumber,navigate}:ContactClickProps) => {
 
  try {
    const currentUserId = getUserId();
    if (!currentUserId) {
      // Redirigir al login si no hay usuario autenticado
      navigate('/login');
      return;
    }

    // Crear o recuperar la conversación existente
    const response = await fetch('https://drivup-backend.onrender.com/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: driverId,      // El ID del conductor
        passengerId: currentUserId // El ID del pasajero actual
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear la conversación');
    }

    const conversationData = await response.json();
    
    // Almacenar ID de la conversación en localStorage para que se abra automáticamente
    localStorage.setItem('openConversationId', conversationData.id.toString());
    setError("");
    if(setIdNumber){
      setIdNumber(0);
    }
    
    // Redirigir a la bandeja de mensajes
    navigate('/dashboard/pasajero/mi-bandeja-de-mensajes');
  } catch (error) {
    console.error('Error al contactar al conductor:', error);
    if(setIdNumber){
      setIdNumber(driverId);
    }
    
    setError('No se pudo contactar al conductor. Intenta nuevamente.');
  }

};

export const usehandleContactClick = () => {
    return (props: ContactClickProps) => handleContactClick(props);
}