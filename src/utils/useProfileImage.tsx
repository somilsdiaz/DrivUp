import { useState, useEffect } from 'react';
import { getUserId } from './auth';
import { getProfileImageUrl } from '../services/profileService';

// hook personalizado para gestionar imágenes de perfil de usuario
export const useProfileImage = (userId?: string | number | null) => {
    // estado para almacenar la url de la imagen y el estado de carga
    const [profileImage, setProfileImage] = useState<string>('/default-profile.png');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // si no se proporciona un userId, usa el del usuario actualmente logueado
        const targetUserId = userId || getUserId();
        
        if (!targetUserId) {
            setIsLoading(false);
            return;
        }

        const fetchProfileImage = async () => {
            setIsLoading(true);
            try {
                // usa el servicio centralizado para obtener la imagen
                const result = await getProfileImageUrl(targetUserId);
                setProfileImage(result.imageUrl);
            } catch (error) {
                console.error('Error al obtener imagen de perfil:', error);
                // mantiene la imagen por defecto en caso de error
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileImage();
    }, [userId]); // se ejecuta cuando cambia el userId

    return { profileImage, isLoading };
};

// hook específico para obtener la imagen del usuario actualmente logueado
export const useCurrentUserProfileImage = () => {
    // reutiliza el hook principal sin pasar userId para que use el del localStorage
    return useProfileImage();
};

export default useProfileImage; 