import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
    redirectPath: string;
}

const RoleBasedRoute = ({ children, allowedRoles, redirectPath }: RoleBasedRouteProps) => {
    const [checking, setChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const userRole = await getUserRole();
                
                //verificar si el rol del usuario esta en los roles permitidos
                const hasPermission = allowedRoles.some(role => 
                    userRole.includes(role) || userRole === role
                );
                
                setHasAccess(hasPermission);
            } catch (error) {
                console.error("Error checking role:", error);
                setHasAccess(false);
            } finally {
                setChecking(false);
            }
        };

        checkUserRole();
    }, [allowedRoles]);

    if (checking) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
                <span className="ml-2">Verificando permisos...</span>
            </div>
        );
    }

    if (!hasAccess) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default RoleBasedRoute; 