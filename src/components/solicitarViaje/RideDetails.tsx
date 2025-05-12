interface RideEstimation {
    distance: string;
    duration: string;
    price: string;
    surge: number;
    basePrice: number;
    surgeMultiplier: number;
    serviceFee: number;
    totalPrice: number;
}

interface RideDetailsProps {
    rideEstimation: RideEstimation;
}

const RideDetails = ({ rideEstimation }: RideDetailsProps) => {

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 pb-6">
                <h3 className="text-xl font-semibold text-[#4A4E69] mb-6">Detalles del Viaje</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#F8F9FA] p-6 rounded-xl">
                        <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <p className="font-semibold text-[#4A4E69]">Distancia</p>
                        </div>
                        <p className="text-2xl font-bold text-[#2D5DA1]">{rideEstimation.distance}</p>
                    </div>
                    <div className="bg-[#F8F9FA] p-6 rounded-xl">
                        <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5AAA95] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-[#4A4E69]">Tiempo</p>
                        </div>
                        <p className="text-2xl font-bold text-[#5AAA95]">{rideEstimation.duration}</p>
                    </div>
                    <div className="bg-[#F8F9FA] p-6 rounded-xl">
                        <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F2B134] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-[#4A4E69]">Precio</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#F2B134]">{rideEstimation.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideDetails; 