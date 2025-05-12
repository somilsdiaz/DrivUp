import { useState, useEffect } from 'react';

interface LocationSelectorProps {
    type: 'origin' | 'destination';
    onLocationChange: (type: string, value: string) => void;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const LocationSelector = ({ type, onLocationChange }: LocationSelectorProps) => {
    const [locationType, setLocationType] = useState(type === 'origin' ? 'current' : 'manual');
    const [manualAddress, setManualAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'distance' | 'popularity'>('distance');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const itemsPerPage = 3;

    // Request location when component mounts if type is origin
    useEffect(() => {
        if (type === 'origin') {
            handleLocationTypeChange('current');
        }
    }, []); // Empty dependency array means this runs once when component mounts

    // Mock data - This should come from props or a service
    const highConcentrationPoints = [
        { id: 1, name: 'Universidad del Norte', address: 'Km.5 Vía Puerto Colombia', distance: '2.5 km', popularity: 'Alta' },
        { id: 2, name: 'Estadio Romelio Martinez', address: 'Calle 72 #46-20', distance: '3.8 km', popularity: 'Media' },
        { id: 3, name: 'Centro Comercial Buenavista', address: 'Cra. 53 #98-2 a 98-150', distance: '1.2 km', popularity: 'Alta' }
    ];

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

    const getPaginatedPoints = () => {
        const filteredPoints = getFilteredAndSortedPoints();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPoints.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleLocationTypeChange = async (newType: string) => {
        setLocationType(newType);
        if (newType === 'current') {
            try {
                setLocationError(null);
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                });

                const coords: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                setCurrentLocation(coords);
                onLocationChange(type, `${coords.latitude},${coords.longitude}`);
            } catch (error) {
                setLocationError('No se pudo obtener tu ubicación. Por favor, verifica que hayas dado permiso de ubicación.');
                console.error('Error getting location:', error);
            }
        } else {
            onLocationChange(type, newType);
        }
    };

    return (
        <div className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${type === 'origin' ? 'bg-[#2D5DA1]/10' : 'bg-[#5AAA95]/10'} flex items-center justify-center mr-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${type === 'origin' ? 'text-[#2D5DA1]' : 'text-[#5AAA95]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#4A4E69]">{type === 'origin' ? 'Origen' : 'Destino'}</h2>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                {type === 'origin' && (
                    <>
                        <button
                            className={`px-6 py-3 rounded-full transition-all duration-200 ${
                                locationType === 'current' 
                                ? 'bg-[#2D5DA1] text-white shadow-md' 
                                : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                            }`}
                            onClick={() => handleLocationTypeChange('current')}
                        >
                            Mi ubicación actual
                        </button>
                        {locationError && (
                            <div className="w-full mt-2 text-red-500 text-sm">
                                {locationError}
                            </div>
                        )}
                        {currentLocation && locationType === 'current' && (
                            <div className="w-full mt-2 text-[#4A4E69] text-sm">
                                Ubicación actual: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                            </div>
                        )}
                    </>
                )}
                <button
                    className={`px-6 py-3 rounded-full transition-all duration-200 ${
                        locationType === 'manual' 
                        ? `${type === 'origin' ? 'bg-[#2D5DA1]' : 'bg-[#5AAA95]'} text-white shadow-md` 
                        : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                    }`}
                    onClick={() => handleLocationTypeChange('manual')}
                >
                    Dirección manual
                </button>
                <button
                    className={`px-6 py-3 rounded-full transition-all duration-200 ${
                        locationType === 'hcp' 
                        ? `${type === 'origin' ? 'bg-[#2D5DA1]' : 'bg-[#5AAA95]'} text-white shadow-md` 
                        : 'bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10'
                    }`}
                    onClick={() => handleLocationTypeChange('hcp')}
                >
                    Punto de concentración
                </button>
            </div>

            {locationType === 'manual' && (
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Ingrese dirección de ${type === 'origin' ? 'origen' : 'destino'}`}
                        className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent transition-all duration-200"
                        value={manualAddress}
                        onChange={(e) => {
                            setManualAddress(e.target.value);
                            onLocationChange(type, e.target.value);
                        }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4E69] absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            )}

            {locationType === 'hcp' && (
                <div className="space-y-4">
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

                    <div className="space-y-3">
                        {getPaginatedPoints().map(point => (
                            <div 
                                key={point.id}
                                className="p-4 border border-gray-200 rounded-xl hover:border-[#2D5DA1] transition-all duration-200 cursor-pointer"
                                onClick={() => onLocationChange(type, point.name)}
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

                    {getFilteredAndSortedPoints().length === 0 && (
                        <div className="text-center py-8 text-[#4A4E69]/60">
                            No se encontraron puntos de concentración
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationSelector; 