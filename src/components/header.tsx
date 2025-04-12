import React, { useState, useEffect } from "react";
import { Bell, Menu as MenuIcon, User, ChevronDown, Search, Car as CarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MenuResponsive from "./menuResponsive";

const Header: React.FC = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    // Mover el scroll al top cada vez que cambia la ruta
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // Se ejecuta cuando cambia la ruta

    return (
        <header className="sticky top-0 z-40 border-b bg-[#2D5DA1] text-white">
            <div className="container flex h-16 items-center justify-between py-4">
                {/* Logo y nombre */}
                <div className="flex items-center gap-2 text-xl font-bold">
                    <Link
                        to="/"
                        className="text-2xl font-bold flex items-center space-x-2">
                        <img src="/drivup_whitelogo.png" alt="UniBus Logo" className="h-16 w-16 mb-2 mr-3" />
                        <span className=" m-0 p-0 ">Driv</span><span className="m-0 p-0 text-[#4ade80]">Up</span>
                    </Link>

                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium hover:underline">
                        Inicio
                    </Link>
                    <Link to="/rutas" className="text-sm font-medium hover:underline">
                        Rutas
                    </Link>
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium hover:underline">
                            <span>Solicitar rutas</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="absolute hidden group-hover:block bg-white text-[#2D5DA1] rounded-lg shadow-lg mt-2 py-2 w-48">
                            <Link to="/solicitar-mi-ruta" className="block px-4 py-2 hover:bg-[#F0F0F0]">
                                Nueva Ruta
                            </Link>
                            <Link to="/mis-solicitudes" className="block px-4 py-2 hover:bg-[#F0F0F0]">
                                Mis Solicitudes
                            </Link>
                        </div>
                    </div>
                    <Link to="/contacto" className="text-sm font-medium hover:underline">
                        Contacto
                    </Link>
                    <Link to="/acerca-de" className="text-sm font-medium hover:underline">
                        Acerca de Unibus
                    </Link>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="text-white hover:bg-[#2D5DA1]/80 px-3 py-1.5 rounded-md text-sm">
                        Iniciar Sesión
                    </button>
                    <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-3 py-1.5 rounded-md text-sm font-medium">
                        Registrarse
                    </button>
  
                </div>
                <button className="md:hidden text-white" onClick={toggleMenu}>
                        <MenuIcon className="h-6 w-6 mr-3" /> 
                    </button>
            </div>

            {/* Componente MenuResponsive */}
            <MenuResponsive isMenuVisible={isMenuVisible} closeMenu={closeMenu} />
        </header>
    );
};

export default Header;
