import React from 'react';

import { DetallesViajeDatos } from './detallesViajeDatos';
import { viajeProps } from '../core/interfaces/detallesViajesProps';



interface MenuResponsiveProps {
    isMenuVisible: boolean;
    closeMenu: () => void;
    data:viajeProps;
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
                    className="absolute rounded-3xl p-1 px-3 top-4 right-4  text-white bg-black opacity-50 hover:text-blue-600 transition-colors"
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
