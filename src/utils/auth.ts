//utilidades de autenticacion

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("userId");
};

export const getUserId = (): string | null => {
    return localStorage.getItem("userId");
};

export const getUserRole = async (): Promise<string> => {
    const userId = getUserId();
    if (!userId) return "";
    
    try {
        const response = await fetch(`http://localhost:5000/usuarios/${userId}/role`);
        if (!response.ok) throw new Error("Error fetching user role");
        
        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error("Error getting user role:", error);
        return "";
    }
};

export const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    //o otras cosas pa eliminar
}; 