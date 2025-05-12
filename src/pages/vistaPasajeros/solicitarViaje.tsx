import { useState, useEffect } from 'react';
import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import LocationSelector from '../../components/solicitarViaje/LocationSelector';
import RideDetails from '../../components/solicitarViaje/RideDetails';
import MapPreview from '../../components/solicitarViaje/MapPreview';
import RequestStatus from '../../components/solicitarViaje/RequestStatus';
import DriverInfo from '../../components/solicitarViaje/DriverInfo';

const SolicitarViaje = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [rideAccepted, setRideAccepted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [estimatedArrival, setEstimatedArrival] = useState('');

    // Mock data
    const rideEstimation = {
        distance: '12.5 km',
        duration: '25 min',
        price: '$15,000 COP',
        surge: 1.2,
        basePrice: 12500,
        surgeMultiplier: 1.2,
        serviceFee: 2000,
        totalPrice: 15000,
    };

    const driverInfo = {
        name: 'Carlos Rodriguez',
        rating: 4.8,
        vehicle: 'Chevrolet Spark',
        plate: 'ABC123',
        eta: '5 min',
        arrivalTime: '35 min',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        completedRides: 1245,
        languages: ['Español', 'Inglés'],
        vehicleFeatures: ['A/C', 'Música', 'Wifi'],
    };

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Calculate estimated arrival time
    useEffect(() => {
        if (rideEstimation.duration) {
            const [minutes] = rideEstimation.duration.split(' ');
            const arrival = new Date();
            arrival.setMinutes(arrival.getMinutes() + parseInt(minutes));
            setEstimatedArrival(arrival.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        }
    }, [rideEstimation.duration]);

    const handleSubmitRequest = () => {
        setRequestSubmitted(true);
        setTimeout(() => setRideAccepted(true), 3000);
    };

    const handleCancelRequest = () => {
        setRequestSubmitted(false);
        setRideAccepted(false);
    };

    const handleLocationChange = (type: string, value: string) => {
        // Handle location changes here
        console.log(`Location ${type} changed to:`, value);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <HeaderFooterPasajeros>
            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header Section with Gradient - Full Width */}
                <div className="w-full bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                    <div className="max-w-7xl mx-auto relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-3">Solicitar Viaje</h1>
                                <p className="text-xl text-white/80">Encuentra tu viaje de manera rápida y segura</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <p className="text-sm opacity-80">Hora actual</p>
                                <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {!requestSubmitted ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Location Selection */}
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <LocationSelector type="origin" onLocationChange={handleLocationChange} />
                                    <LocationSelector type="destination" onLocationChange={handleLocationChange} />
                                </div>
                            </div>

                            {/* Right Column - Map and Details */}
                            <div className="space-y-8">
                                <MapPreview />
                                <RideDetails rideEstimation={rideEstimation} />
                                <button
                                    className="w-full bg-[#F2B134] text-[#4A4E69] py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#F2B134]/90 transition-all duration-200 transform hover:scale-[1.02] mb-4"
                                    onClick={handleSubmitRequest}
                                >
                                    Enviar Solicitud
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {!rideAccepted ? (
                                <RequestStatus onCancel={handleCancelRequest} />
                            ) : (
                                <DriverInfo 
                                    driverInfo={driverInfo}
                                    estimatedArrival={estimatedArrival}
                                    onCancel={handleCancelRequest}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeaderFooterPasajeros>
    );
};

export default SolicitarViaje;
