import react from 'react';
import fleets from '../assets/Merged-fleets.jpg';

const Bienvenida: React.FC = () => {

    return (
        <body className="h-auto min-w-screen flex justify-start items-center bg-[url('src/assets/Merged-fleets.jpg')] bg-auto bg-cover bg-no-repeat bg-center bg-black/50 bg-blend-multiply h-65">
            <div className="mt-3 mb-3 ml-8 w-full max-w-2xl bg-[#e8e8e8] p-8 shadow-lg rounded-lg border-2 border">
                <h1 className="text-[#003747] text-4xl font-bold">UniBus</h1>

                <h2 className="bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text text-2xl font-bold">
                    Conectando estudiantes con el transporte que necesitan, cuando más lo necesitan.
                </h2>
                <p className="mt-4 text-[#5b5b5b] font-bold">
                Ofrecemos rutas de transporte personalizadas para universitarios, reduciendo tiempos de desplazamiento y 
                mejorando la experiencia de transporte.
                </p>

                <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all">
                    Solicitar Ruta
                </button>

            </div>
        </body>

    );
}

export default Bienvenida;