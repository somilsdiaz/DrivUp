import React, { useState, useEffect } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MenuResponsive from "../vistaSinAutenticacion/menuResponsive";

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
            { label: "Solicitar viaje", path: "/" },
            { label: "Mis viajes", path: "/" },
            { label: "Mis reservas", path: "/" },
            { label: "Mi cuenta", path: "/" },
            { label: "Contacto", path: "/" }
        ];

    // Mover el scroll al top cada vez que cambia la ruta
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // Se ejecuta cuando cambia la ruta

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
                        <Link to="/acerca-de" className="text-sm font-medium hover:underline whitespace-nowrap">
                            Mis Reservas
                        </Link>
                    </div>
                </nav>

                {/* Actions - Far right */}
                <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                    <button className="text-white hover:bg-[#2D5DA1]/80 px-3 py-1.5 rounded-md text-sm whitespace-nowrap">
                        Iniciar Sesión
                    </button>
                    <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
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
            />        </header>
    );
};

export default Header;
