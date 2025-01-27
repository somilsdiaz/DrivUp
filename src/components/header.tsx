import { Bell, Menu, User } from "lucide-react";
import { Link } from "react-router-dom"; 

export default function Header() {
    return (
        <header className="bg-[#078930] text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button className="lg:hidden">
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="text-2xl font-bold">
                        UniBus
                    </Link>
                </div>
                <nav className="hidden lg:flex space-x-6">
                    <Link to="/routes" className="hover:text-[#FCD116] transition-colors">
                        Inicio
                    </Link>
                    <Link to="/schedule" className="hover:text-[#FCD116] transition-colors">
                        Rutas
                    </Link>
                    <Link to="/about" className="hover:text-[#FCD116] transition-colors">
                        Solicitar rutas
                    </Link>
                    <Link to="/contact" className="hover:text-[#FCD116] transition-colors">
                        Contacto
                    </Link>
                    <Link to="/contact" className="hover:text-[#FCD116] transition-colors">
                        Acerca de nosotros
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="hover:text-[#FCD116] transition-colors">
                        <Bell size={24} />
                    </button>
                    <button className="hover:text-[#FCD116] transition-colors">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
