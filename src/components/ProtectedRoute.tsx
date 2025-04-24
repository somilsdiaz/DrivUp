import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        //verificar si el usuario esta autenticado
        const authStatus = isAuthenticated();
        setIsAuth(authStatus);
        setChecking(false);
    }, []);

    if (checking) {
        //mostrar el estado de carga mientras se verifica la autenticacion
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
                <span className="ml-2">Verificando autenticación...</span>
            </div>
        );
    }

    if (!isAuth) {
        //redireccionar a la pagina de login si el usuario no esta autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 