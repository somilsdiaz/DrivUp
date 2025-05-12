import rocket from "../assets/Rocket.png";
import { useNavigate } from "react-router-dom";


const AsidePasajeros = () => {
    const navigate = useNavigate();
    return (
            <div className="flex flex-col md:flex-row">

                {/* Sección derecha: Aside Panel */}
                    {/* Sección de actualización en el menú lateral */}
                    <div className="pt-6 lg:mt-12 border-t border-white/30  lg:block">
                        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg p-6 transform transition-all duration-500 hover:scale-105">
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400/60 rounded-full animate-pulse"></div>
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-600/40 rounded-full animate-pulse"></div>

                            <div className="relative text-center">
                                <div className="mb-4 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                                    <img src={rocket} alt="Rocket" className="h-18 w-18" />
                                </div>
                                <p className="text-lg font-semibold text-white">¿Buscas pasajeros para programar viajes?</p>
                                <p className="text-sm text-white/90 mb-4">Encuentra aqui los pasajeros que mas se adapten a tus preferencias de viajes</p>
                                <button
                                    onClick={() => navigate("/dashboard/conductor/lista-pasajeros")}
                                    className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-md">
                                    ¡Haz click aqui!
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
    );
};

export default AsidePasajeros;
