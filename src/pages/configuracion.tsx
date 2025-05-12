import { useState } from "react";
import DriverForm from "./vistaConductores/DriverForm.tsx";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Configuracion: React.FC = () => {
  const [activeSection, setActiveSection] = useState("viaje");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F9FA]">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold text-[#4A4E69]">Configuración</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-[#4A4E69]" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md p-6 w-full md:w-64 z-10 absolute md:static transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <h2 className="text-xl font-semibold mb-4 text-[#4A4E69] hidden md:block">Configuración</h2>
        <hr className="border-t border-black w-full hidden md:block" />
        <ul className="space-y-4 text-[#4A4E69]">
        <li className="font-medium">
            <button
              onClick={() => {
                navigate("/dashboard/conductor");
              }}
              className="w-full py-3 transition font-semibold hover:text-[#5AAA95] hover:scale-105"
            >
              🏠 Inicio
            </button>
          </li>   
          <li className="font-medium">
            <button
              onClick={() => {
                setActiveSection("viaje");
                setSidebarOpen(false);
              }}
              className={`w-full py-3 transition 
              ${activeSection === "viaje"
                  ? "text-[#5AAA95] scale-105 font-semibold"
                  : "hover:text-[#5AAA95] hover:scale-105"
                }`}
            >
              📍 Preferencias de viaje
            </button>
          </li>
          <li className="font-medium">
            <button
              onClick={() => {
                setActiveSection("seguridad");
                setSidebarOpen(false);
              }}
              className={`w-full py-3 transition 
              ${activeSection === "seguridad"
                  ? "text-[#5AAA95] scale-105 font-semibold"
                  : "hover:text-[#5AAA95] hover:scale-105"
                }`}
            >
              🛡️ Inicio de sesión y Seguridad
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{activeSection === "viaje" && <DriverForm />}</main>
    </div>
  );
};

export default Configuracion;
