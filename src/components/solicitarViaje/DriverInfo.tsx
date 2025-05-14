interface DriverInfoProps {
    driverInfo: {
        name: string;
        rating: number;
        vehicle: string;
        plate: string;
        eta: string;
        arrivalTime: string;
        photo: string;
        completedRides: number;
        languages: string[];
        vehicleFeatures: string[];
    };
    estimatedArrival: string;
    onCancel: () => void;
}

// componente que muestra la informacion del conductor asignado al pasajero
const DriverInfo = ({ driverInfo, estimatedArrival, onCancel }: DriverInfoProps) => {
    return (
        <div className="p-8">
            {/* seccion de mensaje de confirmacion */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#5AAA95] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">¡Pronto te recogerán!</h2>
                <p className="text-xl text-[#4A4E69]/80">Tu conductor está en camino</p>
            </div>

            {/* tarjeta con los datos del conductor y vehiculo */}
            <div className="bg-[#F8F9FA] p-8 rounded-xl mb-8">
                <div className="flex items-center mb-8">
                    <img 
                        src={driverInfo.photo} 
                        alt={driverInfo.name}
                        className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                    />
                    <div>
                        <p className="text-2xl font-bold text-[#4A4E69]">{driverInfo.name}</p>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F2B134]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="ml-2 text-[#4A4E69] text-lg">{driverInfo.rating}</span>
                            <span className="ml-4 text-[#4A4E69]/60">• {driverInfo.completedRides} viajes</span>
                        </div>
                        <div className="mt-2 flex items-center">
                            {driverInfo.languages.map((lang, index) => (
                                <span key={index} className="text-xs bg-[#2D5DA1]/10 text-[#2D5DA1] px-2 py-1 rounded-full mr-2">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* informacion del vehiculo y tiempos estimados */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Vehículo</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{driverInfo.vehicle}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {driverInfo.vehicleFeatures.map((feature, index) => (
                                <span key={index} className="text-xs bg-[#5AAA95]/10 text-[#5AAA95] px-2 py-1 rounded-full">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Placa</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{driverInfo.plate}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Tiempo de llegada</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{driverInfo.eta}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Llegada a destino</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{estimatedArrival}</p>
                    </div>
                </div>
            </div>

            {/* espacio reservado para el mapa */}
            <div className="h-[400px] bg-[#F8F9FA] rounded-xl mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="text-[#4A4E69]/60 text-lg">Mapa con ruta final</span>
                    </div>
                </div>
            </div>

            {/* boton para cancelar viaje */}
            <button
                className="w-full bg-[#FF6B6B] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200"
                onClick={onCancel}
            >
                Cancelar Viaje
            </button>
        </div>
    );
};

export default DriverInfo; 