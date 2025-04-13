import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import MenuResponsive from "../menuResponsive";

// Define the MenuItem interface to match the one in menuResponsive.tsx
interface MenuItem {
    label: string;
    path: string;
}

const Header: React.FC = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    // Define menu items
    const menuItems: MenuItem[] = [
        { label: "Pagina de inicio", path: "/" },
        { label: "Viaja", path: "/" },
        { label: "Conduce", path: "/rutas" },
        { label: "Viajes inmediatos", path: "/solicitar-mi-ruta" },
        { label: "Reserva tu viaje", path: "/mis-solicitudes" },
        { label: "Quienes somos", path: "/acerca-de" },
        { label: "Contacto", path: "/contacto" }
    ];

    // Mover el scroll al top cada vez que cambia la ruta
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // Se ejecuta cuando cambia la ruta

    return (
        <header className="sticky top-0 z-40  bg-[#2D5DA1] text-white">
            <div className="container flex h-16 items-center justify-between py-4 px-2 md:px-3 lg:px-4 mx-auto">
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
                <nav className="hidden md:flex items-center justify-center flex-1 px-2 lg:px-4 mx-2 lg:mx-4">
                    <div className="flex items-center gap-3 lg:gap-6 justify-center">
                        <Link to="/" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Viaja
                        </Link>
                        <Link to="/rutas" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Conduce
                        </Link>
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium hover:underline whitespace-nowrap">
                                <span>Como funciona</span>
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute hidden group-hover:block bg-white text-[#2D5DA1] rounded-lg shadow-lg mt-2 py-2 w-48">
                                <Link to="/solicitar-mi-ruta" className="block px-4 py-2 hover:bg-[#F0F0F0] text-sm">
                                    Viajes inmediatos
                                </Link>
                                <Link to="/mis-solicitudes" className="block px-4 py-2 hover:bg-[#F0F0F0] text-sm">
                                    Reserva tu viaje
                                </Link>
                            </div>
                        </div>
                        <Link to="/acerca-de" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Quienes somos
                        </Link>
                        <Link to="/contacto" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Contacto
                        </Link>
                    </div>
                </nav>

                {/* Actions - Far right */}
                <div className="hidden md:flex items-center gap-2 lg:gap-4">
                    <button className="text-white hover:bg-[#2D5DA1]/80 px-2 lg:px-3 py-1.5 rounded-md text-sm whitespace-nowrap">
                        Iniciar Sesión
                    </button>
                    <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-2 lg:px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
                        Registrarse
                    </button>
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
