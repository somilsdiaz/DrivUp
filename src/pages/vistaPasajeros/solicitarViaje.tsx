import { useState, useEffect } from 'react';
import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";

const SolicitarViaje = () => {
    const [originType, setOriginType] = useState('current');
    const [destinationType, setDestinationType] = useState('hcp');
    const [manualAddress, setManualAddress] = useState('');
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [rideAccepted, setRideAccepted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showFareBreakdown, setShowFareBreakdown] = useState(false);
    const [estimatedArrival, setEstimatedArrival] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'distance' | 'popularity'>('distance');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [destSearchTerm, setDestSearchTerm] = useState('');
    const [destSortBy, setDestSortBy] = useState<'distance' | 'popularity'>('distance');
    const [destCurrentPage, setDestCurrentPage] = useState(1);

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

    // Mock data
    const highConcentrationPoints = [
        { id: 1, name: 'Universidad del Norte', address: 'Km.5 Vía Puerto Colombia', distance: '2.5 km', popularity: 'Alta' },
        { id: 2, name: 'Estadio Romelio Martinez', address: 'Calle 72 #46-20', distance: '3.8 km', popularity: 'Media' },
        { id: 3, name: 'Centro Comercial Buenavista', address: 'Cra. 53 #98-2 a 98-150', distance: '1.2 km', popularity: 'Alta' }
    ];

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

    // Add this function to filter and sort points
    const getFilteredAndSortedPoints = () => {
        return highConcentrationPoints
            .filter(point => 
                point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                point.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'distance') {
                    return parseFloat(a.distance) - parseFloat(b.distance);
                } else {
                    return a.popularity === 'Alta' ? -1 : b.popularity === 'Alta' ? 1 : 0;
                }
            });
    };

    // Add this function to get paginated points
    const getPaginatedPoints = () => {
        const filteredPoints = getFilteredAndSortedPoints();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPoints.slice(startIndex, startIndex + itemsPerPage);
    };

    // Add this function to filter and sort destination points
    const getFilteredAndSortedDestPoints = () => {
        return highConcentrationPoints
            .filter(point => 
                point.name.toLowerCase().includes(destSearchTerm.toLowerCase()) ||
                point.address.toLowerCase().includes(destSearchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (destSortBy === 'distance') {
                    return parseFloat(a.distance) - parseFloat(b.distance);
                } else {
                    return a.popularity === 'Alta' ? -1 : b.popularity === 'Alta' ? 1 : 0;
                }
            });
    };

    // Add this function to get paginated destination points
    const getPaginatedDestPoints = () => {
        const filteredPoints = getFilteredAndSortedDestPoints();
        const startIndex = (destCurrentPage - 1) * itemsPerPage;
        return filteredPoints.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleSubmitRequest = () => {
        setRequestSubmitted(true);
        setTimeout(() => setRideAccepted(true), 3000);
    };

    const handleCancelRequest = () => {
        setRequestSubmitted(false);
        setRideAccepted(false);
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
                                    {/* Origin Section */}
                                    <div className="p-8 border-b border-gray-100">
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 rounded-full bg-[#2D5DA1]/10 flex items-center justify-center mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-[#4A4E69]">Origen</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <button
                                                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                                    originType === 'current' 
                                                    ? 'bg-[#2D5DA1] text-white shadow-md' 
                                                    : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                                                }`}
                                                onClick={() => setOriginType('current')}
                                            >
                                                Mi ubicación actual
                                            </button>
                                            <button
                                                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                                    originType === 'manual' 
                                                    ? 'bg-[#2D5DA1] text-white shadow-md' 
                                                    : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                                                }`}
                                                onClick={() => setOriginType('manual')}
                                            >
                                                Dirección manual
                                            </button>
                                            <button
                                                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                                    originType === 'hcp' 
                                                    ? 'bg-[#2D5DA1] text-white shadow-md' 
                                                    : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                                                }`}
                                                onClick={() => setOriginType('hcp')}
                                            >
                                                Punto de concentración
                                            </button>
                                        </div>

                                        {originType === 'manual' && (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Ingrese dirección de origen"
                                                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent transition-all duration-200"
                                                    value={manualAddress}
                                                    onChange={(e) => setManualAddress(e.target.value)}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4E69] absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        )}

                                        {originType === 'hcp' && (
                                            <div className="space-y-4">
                                                {/* Search and Sort Controls */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar punto de concentración..."
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2D5DA1]"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                    <select
                                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2D5DA1]"
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value as 'distance' | 'popularity')}
                                                    >
                                                        <option value="distance">Ordenar por distancia</option>
                                                        <option value="popularity">Ordenar por popularidad</option>
                                                    </select>
                                                </div>

                                                {/* Points List */}
                                                <div className="space-y-3">
                                                    {getPaginatedPoints().map(point => (
                                                        <div 
                                                            key={point.id}
                                                            className="p-4 border border-gray-200 rounded-xl hover:border-[#2D5DA1] transition-all duration-200 cursor-pointer"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h3 className="font-semibold text-[#4A4E69]">{point.name}</h3>
                                                                    <p className="text-sm text-[#4A4E69]/60">{point.address}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xs text-[#4A4E69]/60">Popularidad: {point.popularity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Pagination */}
                                                {getFilteredAndSortedPoints().length > itemsPerPage && (
                                                    <div className="flex justify-center gap-2 mt-4">
                                                        <button
                                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                            disabled={currentPage === 1}
                                                            className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                                        >
                                                            Anterior
                                                        </button>
                                                        <span className="px-3 py-1">
                                                            Página {currentPage} de {Math.ceil(getFilteredAndSortedPoints().length / itemsPerPage)}
                                                        </span>
                                                        <button
                                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(getFilteredAndSortedPoints().length / itemsPerPage)))}
                                                            disabled={currentPage === Math.ceil(getFilteredAndSortedPoints().length / itemsPerPage)}
                                                            className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                                        >
                                                            Siguiente
                                                        </button>
                                                    </div>
                                                )}

                                                {/* No Results Message */}
                                                {getFilteredAndSortedPoints().length === 0 && (
                                                    <div className="text-center py-8 text-[#4A4E69]/60">
                                                        No se encontraron puntos de concentración
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Destination Section */}
                                    <div className="p-8">
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 rounded-full bg-[#5AAA95]/10 flex items-center justify-center mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-[#4A4E69]">Destino</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <button
                                                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                                    destinationType === 'manual' 
                                                    ? 'bg-[#5AAA95] text-white shadow-md' 
                                                    : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#5AAA95]/10'
                                                }`}
                                                onClick={() => setDestinationType('manual')}
                                            >
                                                Dirección manual
                                            </button>
                                            <button
                                                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                                    destinationType === 'hcp' 
                                                    ? 'bg-[#5AAA95] text-white shadow-md' 
                                                    : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#5AAA95]/10'
                                                }`}
                                                onClick={() => setDestinationType('hcp')}
                                            >
                                                Punto de concentración
                                            </button>
                                        </div>

                                        {destinationType === 'manual' && (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Ingrese dirección de destino"
                                                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5AAA95] focus:border-transparent transition-all duration-200"
                                                    value={manualAddress}
                                                    onChange={(e) => setManualAddress(e.target.value)}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4E69] absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        )}

                                        {destinationType === 'hcp' && (
                                            <div className="space-y-4">
                                                {/* Search and Sort Controls */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar punto de concentración..."
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5AAA95]"
                                                            value={destSearchTerm}
                                                            onChange={(e) => setDestSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                    <select
                                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5AAA95]"
                                                        value={destSortBy}
                                                        onChange={(e) => setDestSortBy(e.target.value as 'distance' | 'popularity')}
                                                    >
                                                        <option value="distance">Ordenar por distancia</option>
                                                        <option value="popularity">Ordenar por popularidad</option>
                                                    </select>
                                                </div>

                                                {/* Points List */}
                                            <div className="space-y-3">
                                                    {getPaginatedDestPoints().map(point => (
                                                    <div 
                                                        key={point.id}
                                                        className="p-4 border border-gray-200 rounded-xl hover:border-[#5AAA95] transition-all duration-200 cursor-pointer"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-semibold text-[#4A4E69]">{point.name}</h3>
                                                                <p className="text-sm text-[#4A4E69]/60">{point.address}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs text-[#4A4E69]/60">Popularidad: {point.popularity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                            </div>

                                                {/* Pagination */}
                                                {getFilteredAndSortedDestPoints().length > itemsPerPage && (
                                                    <div className="flex justify-center gap-2 mt-4">
                                            <button
                                                            onClick={() => setDestCurrentPage(prev => Math.max(prev - 1, 1))}
                                                            disabled={destCurrentPage === 1}
                                                            className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                            >
                                                            Anterior
                                            </button>
                                                        <span className="px-3 py-1">
                                                            Página {destCurrentPage} de {Math.ceil(getFilteredAndSortedDestPoints().length / itemsPerPage)}
                                                        </span>
                                    <button
                                                            onClick={() => setDestCurrentPage(prev => Math.min(prev + 1, Math.ceil(getFilteredAndSortedDestPoints().length / itemsPerPage)))}
                                                            disabled={destCurrentPage === Math.ceil(getFilteredAndSortedDestPoints().length / itemsPerPage)}
                                                            className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                    >
                                                            Siguiente
                                    </button>
                                </div>
                            )}

                                                {/* No Results Message */}
                                                {getFilteredAndSortedDestPoints().length === 0 && (
                                                    <div className="text-center py-8 text-[#4A4E69]/60">
                                                        No se encontraron puntos de concentración
                                                    </div>
                                                )}
                        </div>
                    )}
                </div>
            </div>
                            </div>

                            {/* Right Column - Map and Details */}
                            <div className="space-y-8">
                                {/* Map Preview */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="h-[400px] bg-[#F8F9FA] relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                <span className="text-[#4A4E69]/60 text-lg">Mapa con ruta prevista</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ride Estimation */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="p-8 pb-3">
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
                                                    {rideEstimation.surge > 1 && (
                                                        <div className="flex items-center mt-1">
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                className="text-[#2D5DA1] text-sm font-medium flex items-center"
                                                onClick={() => setShowFareBreakdown(!showFareBreakdown)}
                                            >
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
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
                                <div className="p-8 text-center">
                                    <div className="mb-8">
                                        <div className="w-24 h-24 border-4 border-[#2D5DA1] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">Tu solicitud ha sido enviada</h2>
                                    <p className="text-xl text-[#4A4E69]/80 mb-8">Te avisaremos cuando un conductor acepte tu solicitud</p>

                                    <div className="h-[400px] bg-[#F8F9FA] rounded-xl mb-8 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                <span className="text-[#4A4E69]/60 text-lg">Mapa con ruta prevista</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-[#FF6B6B] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200"
                                        onClick={handleCancelRequest}
                                    >
                                        Cancelar Solicitud
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="w-24 h-24 bg-[#5AAA95] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">¡Pronto te recogerán!</h2>
                                        <p className="text-xl text-[#4A4E69]/80">Tu conductor está en camino</p>
                                    </div>

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

                                    <button
                                        className="w-full bg-[#FF6B6B] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200"
                                        onClick={handleCancelRequest}
                                    >
                                        Cancelar Viaje
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeaderFooterPasajeros>
    );
};

export default SolicitarViaje;
