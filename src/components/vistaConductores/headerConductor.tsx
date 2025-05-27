import React, { useState, useEffect, useRef } from "react";
import { Menu as MenuIcon, ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MenuResponsive from "../menuResponsive";
import { logout, getUserId } from "../../utils/auth";
// Interfaz que coincide con la que se usa en menuResponsive.tsx
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
        { label: "Buscar viaje", path: "/dashboard/conductor/lista-viajes" },
        { label: "Mis viajes", path: "/en-proceso" },
        { label: "Solicitudes", path: "/dashboard/conductor/solicitudes" },
        { label: "Viajes programados", path: "/en-proceso" },
        { label: "Mi perfil", path: "/dashboard/conductor/datos-conductor" },
        { label: "Configuracion", path: "/dashboard/conductor/configuracion" },
        { label: "Ayuda/Soporte", path: "/en-proceso" },
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
        <header className="sticky top-0 z-40 bg-[#0a0d35] text-white">
            <div className="container flex h-16 items-center justify-between py-4 px-2 sm:px-4 mx-auto">
                {/* Logo y nombre - Far left */}
                <div className="flex-shrink-0">
                    <Link
                        to="/dashboard/conductor"
                        className="text-xl md:text-2xl font-bold flex items-center">
                        <img src="/drivup_whitelogo.png" alt="DrivUp Logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 mr-1 md:mr-3" />
                        <span className="m-0 p-0">Driv</span><span className="m-0 p-0 text-[#4ade80]">Up</span>
                    </Link>
                </div>

                {/* Navigation - Center */}
                <nav className="hidden md:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-2 lg:gap-6 justify-center flex-wrap">
                        <Link to="/dashboard/conductor/lista-viajes" className="text-xs lg:text-sm font-medium hover:underline whitespace-nowrap px-1">
                            Buscar Viaje
                        </Link>
                        <Link to="/en-proceso" className="text-xs lg:text-sm font-medium hover:underline whitespace-nowrap px-1">
                            Mis viajes
                        </Link>
                        <Link to="/dashboard/conductor/solicitudes" className="text-xs lg:text-sm font-medium hover:underline whitespace-nowrap px-1">
                            Solicitudes
                        </Link>
                        <Link to="/en-proceso" className="text-xs lg:text-sm font-medium hover:underline whitespace-nowrap px-1">
                            Viajes programados
                        </Link>
                    </div>
                </nav>

                {/* User Profile - Far right */}
                <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0 relative" ref={profileMenuRef}>
                    <div
                        className="flex items-center gap-1 lg:gap-2 cursor-pointer hover:bg-[#1a1f55] rounded-md px-2 lg:px-3 py-1.5"
                        onClick={toggleProfileMenu}
                    >
                        <span className="text-xs lg:text-sm font-medium truncate max-w-[80px] lg:max-w-full">Mi cuenta</span>
                        <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                    </div>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 bg-[#0a0d35] border border-[#2D2D2D] rounded-md shadow-lg py-2 w-48 z-50">
                            <div className="px-4 py-2 border-b border-[#2D2D2D]">
                                <p className="text-sm font-medium">{userName}</p>
                                <p className="text-xs text-gray-400">{userEmail}</p>
                            </div>
                            <div className="py-1">
                                <Link to="/dashboard/conductor/datos-conductor" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#1a1f55] w-full text-left">
                                    <User className="h-4 w-4" />
                                    Mi Perfil
                                </Link>
                                <Link to="/dashboard/conductor/configuracion" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#1a1f55] w-full text-left">
                                    <Settings className="h-4 w-4" />
                                    Configuración
                                </Link>
                                <Link to="/en-proceso" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#1a1f55] w-full text-left">
                                    <HelpCircle className="h-4 w-4" />
                                    Ayuda/Soporte
                                </Link>
                                <div className="border-t border-[#2D2D2D] my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#1a1f55] w-full text-left text-red-400"
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
