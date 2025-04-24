//utilidades de autenticacion


//verificar si el usuario esta autenticado
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("userId");
};

//obtener el id del usuario
export const getUserId = (): string | null => {
    return localStorage.getItem("userId");
};

//obtener el rol del usuario
export const getUserRole = async (): Promise<string> => {
    const userId = getUserId();
    if (!userId) return "";
    
    try {
        const response = await fetch(`https://drivup-backend.onrender.com/usuarios/${userId}/role`);
        if (!response.ok) throw new Error("Error fetching user role");
        
        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error("Error getting user role:", error);
        return "";
    }
};

//cerrar sesion
export const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    //o otras cosas pa eliminar
}; 