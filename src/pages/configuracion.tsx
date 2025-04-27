import { useState } from "react";
import DriverForm from "./vistaConductores/DriverForm.tsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


const Configuracion: React.FC = () => {

    const [activeSection, setActiveSection] = useState("viaje");


    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#4A4E69]">Configuración</h2>
                <hr className="border-t border-black w-full" />
                <ul className="space-y-4 text-[#4A4E69]">
                    <li className="font-medium">
                        <button
                            onClick={() => setActiveSection("viaje")}
                            className={`w-full py-3 transition 
            ${activeSection === "viaje" ? "text-[#5AAA95] scale-125 font-semibold" : "hover:text-[#5AAA95] hover:scale-125"}
        `}
                        >📍 Preferencias de viaje</button>
                    </li>
                    <li className="font-medium">
                        <button
                            onClick={() => setActiveSection("seguridad")}
                            className={`w-full py-3 transition 
            ${activeSection === "seguridad" ? "text-[#5AAA95] scale-125 font-semibold" : "hover:text-[#5AAA95] hover:scale-125"}
        `}
                        >
                            🛡️ Inicio de sesión y Seguridad</button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            {activeSection === "viaje" && <DriverForm />}
        </div>


    );

};

export default Configuracion;