interface RideEstimation {
    distance: string;
    duration: string;
    price: string;
    basePrice: number;
    serviceFee: number;
    totalPrice: number;
    
    // Detailed API data
    detailedData?: {
        distancia?: {
            metros: number;
            kilometros: number;
        };
        tiempo?: {
            tiempoTotalMinutos: number;
            desglose: {
                tiempoViajeBasico: number;
                tiempoTrafico: number;
                tiempoRecogida: number;
                tiempoLlegada: number;
            };
        };
        costo?: {
            costoMinimo: number;
            costoMaximo: number;
            desglose: {
                costoBase: number;
                costoPorPasajero: number;
                comisionPlataforma: number;
                factorPasajeros: number;
            };
        };
    };
    passengerCount?: number;
    alternativeOptions?: {
        [key: string]: {
            costo: {
                costoMinimo: number;
                costoMaximo: number;
            };
        };
    };
}

interface RideDetailsProps {
    rideEstimation: RideEstimation;
    passengerCount: number;
    setPassengerCount: (count: number) => void;
    isLoading?: boolean;
}

const RideDetails = ({ rideEstimation, passengerCount, setPassengerCount, isLoading = false }: RideDetailsProps) => {
    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get the price display text based on price format
    const getPriceDisplay = () => {
        if (isLoading) {
            return "Calculando...";
        }
        
        if (rideEstimation.detailedData?.costo) {
            const { costoMinimo, costoMaximo } = rideEstimation.detailedData.costo;
            return `${formatCurrency(costoMinimo)} - ${formatCurrency(costoMaximo)}`;
        }
        
        return rideEstimation.price;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 pb-6">
                <h3 className="text-xl font-semibold text-[#4A4E69] mb-6">Detalles del Viaje</h3>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D5DA1]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="bg-[#F8F9FA] p-6 rounded-xl">
                                <div className="flex items-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <p className="font-semibold text-[#4A4E69]">Distancia</p>
                                </div>
                                <p className="text-2xl font-bold text-[#2D5DA1]">
                                    {rideEstimation.detailedData?.distancia 
                                        ? `${rideEstimation.detailedData.distancia.kilometros.toFixed(1)} km`
                                        : rideEstimation.distance}
                                </p>
                            </div>
                            <div className="bg-[#F8F9FA] p-6 rounded-xl">
                                <div className="flex items-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5AAA95] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-semibold text-[#4A4E69]">Tiempo</p>
                                </div>
                                <p className="text-2xl font-bold text-[#5AAA95]">
                                    {rideEstimation.detailedData?.tiempo 
                                        ? `${rideEstimation.detailedData.tiempo.tiempoTotalMinutos} min`
                                        : rideEstimation.duration}
                                </p>
                            </div>
                            <div className="bg-[#F8F9FA] p-6 rounded-xl">
                                <div className="flex items-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F2B134] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-semibold text-[#4A4E69]">Precio</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#F2B134]">{getPriceDisplay()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Passenger selection */}
                        <div className="bg-[#F8F9FA] p-6 rounded-xl">
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4E69] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="font-semibold text-[#4A4E69]">Número de pasajeros</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-4">
                                    {[3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setPassengerCount(num)}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                                                passengerCount === num
                                                    ? 'bg-[#2D5DA1] text-white shadow-md'
                                                    : 'bg-white text-[#4A4E69] border border-gray-200 hover:border-[#2D5DA1]/70'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                
                                {rideEstimation.alternativeOptions && 
                                 rideEstimation.alternativeOptions[`pasajeros_${passengerCount}`] && (
                                    <div className="text-right">
                                        <p className="text-sm text-[#4A4E69]/70">Precio estimado</p>
                                        <p className="font-bold text-[#F2B134]">
                                            {formatCurrency(rideEstimation.alternativeOptions[`pasajeros_${passengerCount}`].costo.costoMinimo)} - 
                                            {formatCurrency(rideEstimation.alternativeOptions[`pasajeros_${passengerCount}`].costo.costoMaximo)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RideDetails; 