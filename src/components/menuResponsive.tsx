import React from 'react';
import { Link } from "react-router-dom";

interface MenuItem {
    label: string;
    path: string;
}

interface MenuResponsiveProps {
    isMenuVisible: boolean;
    closeMenu: () => void;
    menuItems: MenuItem[];
}

const MenuResponsive: React.FC<MenuResponsiveProps> = ({ isMenuVisible, closeMenu, menuItems }) => {
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
                        {menuItems.map((item, index) => (
                            <li key={index} onClick={closeMenu}>
                                <Link 
                                    to={item.path} 
                                    className="block text-xl font-medium text-gray-800 hover:bg-gray-100 hover:translate-x-1 transform transition-all rounded-lg px-4 py-2"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default MenuResponsive;
