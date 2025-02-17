import React from 'react';
import { Link } from "react-router-dom";

interface MenuResponsiveProps {
    isMenuVisible: boolean;
    closeMenu: () => void;
}

const MenuResponsive: React.FC<MenuResponsiveProps> = ({ isMenuVisible, closeMenu }) => {
    return (
        <div>
            {/* Menu */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-full bg-gray-100 bg-opacity-95 shadow-lg z-[1050] overflow-y-auto transition-transform duration-300 ${isMenuVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CF251F] via-[#FCD116]  to-[#078930]"></div>
                <button
                    className="absolute top-4 right-4 text-3xl text-gray-800 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                >
                    &times;
                </button>
                <nav className="flex flex-col pt-20 pl-9 space-y-4">
                    <ul className="space-y-4">
                        <li onClick={closeMenu}>
                            <Link to="/" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2">
                                Pagina de inicio
                            </Link>
                            
                        </li>
                        <li onClick={closeMenu}>
                            <Link to="/rutas" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2">
                                Rutas
                            </Link>

                        </li>
                        <li onClick={closeMenu}>
                            <Link to="/solicitar-mi-ruta" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2" >
                                Nueva Ruta
                            </Link>

                        </li>
                        <li onClick={closeMenu}>
                            <Link to="/mis-solicitudes" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2" >
                                Mis Solicitudes
                            </Link>
                        </li>
                        <li onClick={closeMenu}>
                            <Link to="/contacto" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2" >
                                Contacto
                            </Link>
                        </li>
                        <li onClick={closeMenu}>
                            <Link to="/acerca-de" className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2" >
                                Acerca del proyecto
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default MenuResponsive;
