import React, { useState, useEffect, useRef } from "react";
import { Menu as MenuIcon, ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MenuResponsive from "../menuResponsive";
import { logout, getUserId } from "../../utils/auth";

//MenuItem interface to match the one in menuResponsive.tsx
interface MenuItem {
    label: string;
    path: string;
}

const Header: React.FC = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [userName, setUserName] = useState("Usuario");
    const [userEmail, setUserEmail] = useState("usuario@example.com");
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = getUserId();
            if (!userId) return;
            
            try {
                const response = await fetch(`https://drivup-backend.onrender.com/usuario/${userId}`);
                if (!response.ok) throw new Error("Error fetching user data");
                
                const userData = await response.json();
                // Format name to display first name and first last name
                setUserName(`${userData.name} ${userData.last_name}`);
                setUserEmail(userData.email);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        
        fetchUserData();
    }, []);

    const toggleMenu = () => {
        setIsMenuVisible((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen((prev) => !prev);
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Define menu items
    const menuItems: MenuItem[] = [
        { label: "Solicitar viaje", path: "/" },
        { label: "Mis viajes", path: "/" },
        { label: "Solicitar conductores", path: "/dashboard/pasajero/lista-conductores" },
        { label: "Bandeja de mensajes", path: "/dashboard/pasajero/mi-bandeja-de-mensajes" },
        { label: "Mi perfil", path: "/" },
        { label: "Configuracion", path: "/dashboard/pasajero/configuracion" },
        { label: "Ayuda/Soporte", path: "/" },
        { label: "Cerrar sesión", path: "/" }
    ];

    // Mover el scroll al top cada vez que cambia la ruta
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // Se ejecuta cuando cambia la ruta

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-[#003E69] text-white">
            <div className="container flex h-16 items-center justify-between py-4 px-4 mx-auto">
                {/* Logo y nombre - Far left */}
                <div className="flex-shrink-0">
                    <Link
                        to="/"
                        className="text-2xl font-bold flex items-center space-x-2">
                        <img src="/drivup_whitelogo.png" alt="DrivUp Logo" className="h-16 w-16 mb-2 mr-3" />
                        <span className="m-0 p-0">Driv</span><span className="m-0 p-0 text-[#4ade80]">Up</span>
                    </Link>
                </div>

                {/* Navigation - Center */}
                <nav className="hidden md:flex items-center justify-start flex-1 px-4 mx-4">
                    <div className="flex items-center gap-6 justify-center">
                        <Link to="/" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Solicitar viaje
                        </Link>
                        <Link to="/rutas" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Mis Viajes
                        </Link>
                        <Link to="/dashboard/pasajero/lista-conductores" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Solicitar conductor
                        </Link>
                        <Link to="/dashboard/pasajero/mi-bandeja-de-mensajes" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Bandeja de mensajes
                        </Link>
                    </div>
                </nav>

                {/* User Profile - Far right */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0 relative" ref={profileMenuRef}>
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#0051A8] rounded-md px-3 py-1.5"
                        onClick={toggleProfileMenu}
                    >
                        <div className="h-8 w-8 rounded-full bg-[#4ade80] flex items-center justify-center overflow-hidden">
                            <img
                                src="/avatar-placeholder.jpg"
                                alt="Profile"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                        <span className="text-sm font-medium">{userName}</span>
                        <ChevronDown className="h-4 w-4" />
                    </div>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 bg-[#003E69] border border-[#276A9C] rounded-md shadow-lg py-2 w-48 z-50">
                            <div className="px-4 py-2 border-b border-[#276A9C]">
                                <p className="text-sm font-medium">{userName}</p>
                                <p className="text-xs text-gray-300">{userEmail}</p>
                            </div>
                            <div className="py-1">
                                <Link to="/perfil" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#0051A8] w-full text-left">
                                    <User className="h-4 w-4" />
                                    Mi Perfil
                                </Link>
                                <Link to="/dashboard/pasajero/configuracion" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#0051A8] w-full text-left">
                                    <Settings className="h-4 w-4" />
                                    Configuración
                                </Link>
                                <Link to="/ayuda" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#0051A8] w-full text-left">
                                    <HelpCircle className="h-4 w-4" />
                                    Ayuda/Soporte
                                </Link>
                                <div className="border-t border-[#276A9C] my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#0051A8] w-full text-left text-red-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile menu button - Far right on mobile */}
                <button className="md:hidden text-white flex-shrink-0" onClick={toggleMenu}>
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Componente MenuResponsive */}
            <MenuResponsive
                isMenuVisible={isMenuVisible}
                closeMenu={closeMenu}
                menuItems={menuItems}
            />
        </header>
    );
};

export default Header;
