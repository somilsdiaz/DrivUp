// servicio centralizado para operaciones relacionadas con perfiles de usuario

// url base para las peticiones a la api
const API_BASE_URL = 'https://drivup-backend.onrender.com';

/**
 * obtiene la url de la imagen de perfil de un usuario
 * @param userId - id del usuario
 * @returns objeto con la url de la imagen y estado de éxito
 */
export const getProfileImageUrl = async (userId: string | number): Promise<{ 
    success: boolean; 
    imageUrl: string;
    error?: string;
}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario/${userId}/foto-perfil`);
        
        if (!response.ok) {
            return { 
                success: false, 
                imageUrl: '/default-profile.png',
                error: `Error ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        
        if (data.fotoPerfil) {
            return { 
                success: true, 
                imageUrl: `${API_BASE_URL}/uploads/${data.fotoPerfil}` 
            };
        }
        
        // si no tiene foto de perfil, devuelve la imagen por defecto
        return { 
            success: false, 
            imageUrl: '/default-profile.png',
            error: 'Usuario sin foto de perfil'
        };
    } catch (error) {
        console.error('Error al obtener imagen de perfil:', error);
        return { 
            success: false, 
            imageUrl: '/default-profile.png',
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
};

// otras funciones relacionadas con perfiles pueden agregarse aquí 