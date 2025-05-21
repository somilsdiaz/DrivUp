import React from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { logout } from "../utils/auth";
import { DetallesViajeDatos, viajesProps } from './detallesViajeDatos';

// interface MenuItem {
//     label: string;
//     path: string;
// }

interface MenuResponsiveProps {
    isMenuVisible: boolean;
    closeMenu: () => void;
    data:viajesProps;
}

const DetallesViajeResponsive: React.FC<MenuResponsiveProps> = ({ isMenuVisible, closeMenu,data }) => {
   
    return (
        <div>
            {/* Menu */}
            <div
                className={`fixed inset-y-0 right-0 w-2/4 max-w-2/4 bg-gray-100 bg-opacity-95 shadow-lg z-[1050] overflow-y-auto transition-transform duration-300 ${isMenuVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CF251F] via-[#FCD116]  to-[#078930]"></div>
                <button
                    className="absolute top-4 right-4 text-3xl text-gray-800 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                >
                    &times;
                </button>
                <DetallesViajeDatos {...data}/>
            </div>
        </div>
    );
};

export default DetallesViajeResponsive;
