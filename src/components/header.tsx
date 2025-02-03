import React, { useState } from "react";
import { Bell, Menu, User, ChevronDown, Search } from "lucide-react";
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

    return (
        <header className="bg-gradient-to-r from-[#078930] to-[#0AAB4B] text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">

                {/* Logo y nombre de la pagina */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 rounded-lg hover:bg-[#0AAB4B] transition-colors">
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
                        <img src="/src/assets/unibus-high-resolution-logo-grayscale-transparent.png" alt="UniBus Logo" className="h-11 w-10 mb-2 mr-3" />
                        <span>UniBus</span>
                    </Link>
                </div>
                {/* Componente MenuResponsive */}
                <MenuResponsive isMenuVisible={isMenuVisible} closeMenu={closeMenu} />

                {/*Elementos del header*/}
                <nav className="hidden lg:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-[#FCD116] transition-colors font-medium">
                        Inicio
                    </Link>
                    <Link to="/rutas" className="hover:text-[#FCD116] transition-colors font-medium">
                        Rutas
                    </Link>
                    <div className="relative group">
                        <button className="flex items-center space-x-1 hover:text-[#FCD116] transition-colors font-medium">
                            <span>Solicitar rutas</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="absolute hidden group-hover:block bg-white text-[#078930] rounded-lg shadow-lg mt-2 py-2 w-48">
                            <Link to="/solicitar-mi-ruta" className="block px-4 py-2 hover:bg-[#F0F0F0]">
                                Nueva Ruta
                            </Link>
                            <Link to="/mis-solicitudes" className="block px-4 py-2 hover:bg-[#F0F0F0]">
                                Mis Solicitudes
                            </Link>
                        </div>
                    </div>
                    <Link to="/contacto" className="hover:text-[#FCD116] transition-colors font-medium">
                        Contacto
                    </Link>
                    <Link to="/acerca-de" className="hover:text-[#FCD116] transition-colors font-medium">
                        Acerca de nosotros
                    </Link>
                </nav>

                {/*botones de acceso*/}
                <div className="flex items-center space-x-4">
                    <div className="relative hidden lg:block">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="bg-white/20 backdrop-blur-sm rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCD116]"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[#0AAB4B] transition-colors relative">
                        <Bell size={24} />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                            3
                        </span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#0AAB4B] transition-colors">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};
export default Header;