import { useNavigate } from "react-router-dom";
import background from "../assets/merged_fleets.mp4";



const Bienvenida: React.FC = () => {

    const navigate = useNavigate();

    return (
        <body
         className="relative py-80 w-full flex sm:justify-center md:justify-center lg:justify-start items-center h-65 overflow-hidden">
            <video 
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
            >
                <source src={background} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

            <div className="relative ml-0 sm:ml-0 md:ml-0 lg:ml-8 w-full max-w-2xl bg-[#e8e8e8] p-8 shadow-lg rounded-lg border-2 border">

                <h1 className="text-[#003747] text-4xl font-bold">UniBus</h1>

                <h2 className="bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text text-2xl font-bold">
                    Conectando estudiantes con el transporte que necesitan, cuando más lo necesitan.
                </h2>
                <p className="mt-4 text-[#5b5b5b] font-bold">
                    Ofrecemos rutas de transporte personalizadas para universitarios, reduciendo tiempos de desplazamiento y
                    mejorando la experiencia de transporte.
                </p>

                <button onClick={() => navigate("/solicitar-mi-ruta")} className="mt-6 px-6 py-3 bg-[#2e9700] text-white font-semibold rounded-lg shadow-md hover:bg-[#38761d] transition-all hover:scale-105">
                    Solicitar Ruta
                </button>

            </div>
        </body>

    );
}

export default Bienvenida;