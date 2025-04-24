import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        //verificado si el usuario esta autenticado
        const authStatus = isAuthenticated();
        setIsAuth(authStatus);
        setChecking(false);
    }, []);

    if (checking) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
                <span className="ml-2">Verificando...</span>
            </div>
        );
    }

    if (isAuth) {
        //redireccionar a la pagina de dashboard si el usuario ya esta autenticado
        return <Navigate to="/dashboard/pasajero" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute; 