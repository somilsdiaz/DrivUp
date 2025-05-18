import { useState, useEffect } from 'react';

interface ConcentrationPoint {
    id: number;
    nombre: string;
    latitud: string;
    longitud: string;
    descripcion: string | null;
    created_at: string;
    updated_at: string;
    direccion_fisica: string;
}

interface LocationSelectorProps {
    type: 'origin' | 'destination';
    onLocationChange: (type: string, value: string, locationType?: string, pointId?: number) => void;
    onManualAddressInput?: (type: string, value: string) => void;
    concentrationPoints?: ConcentrationPoint[];
    disabledOptions?: string[];
    selectedLocationType?: string;
    onCurrentLocationIsCP?: (concentrationPoint: any) => void;
    isCPHighlighted?: boolean;
    originIsCPHighlighted?: boolean;
    detectedCPInfo?: ConcentrationPoint;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface AddressInfo {
    direccion: string;
    detallesDireccion?: {
        road?: string;
        neighbourhood?: string;
        town?: string;
        state?: string;
        region?: string;
        postcode?: string;
        country?: string;
    };
}

// componente para seleccionar ubicaciones (origen o destino)
const LocationSelector = ({ 
    type, 
    onLocationChange, 
    onManualAddressInput, 
    concentrationPoints = [],
    disabledOptions = [],
    selectedLocationType,
    onCurrentLocationIsCP,
    isCPHighlighted = false,
    originIsCPHighlighted = false,
    detectedCPInfo
}: LocationSelectorProps) => {
    // estado para el tipo de ubicacion (current, manual, hcp)
    const [locationType, setLocationType] = useState(type === 'origin' ? 'current' : 'manual');
    const [manualAddress, setManualAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [filteredPoints, setFilteredPoints] = useState<ConcentrationPoint[]>([]);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const itemsPerPage = 3;

    // sincroniza el tipo de ubicacion con el seleccionado por el componente padre
    useEffect(() => {
        if (selectedLocationType && selectedLocationType !== locationType) {
            setLocationType(selectedLocationType);
        }
        
        // Forzar tipo 'manual' si es destino y el origen es un punto de concentración
        if (type === 'destination' && originIsCPHighlighted && locationType !== 'manual') {
            setLocationType('manual');
            
            // Asegurar que no se desplace automáticamente
            setTimeout(() => {
                // Restaurar la posición del scroll (solo si es necesario)
                const scrollY = window.scrollY;
                if (scrollY > 0) {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }
            }, 50);
        }
    }, [selectedLocationType, originIsCPHighlighted, type, locationType]);

    // solicita la ubicacion actual al iniciar si el tipo es origen
    useEffect(() => {
        if (type === 'origin') {
            handleLocationTypeChange('current');
        }
    }, []); // Empty dependency array means this runs once when component mounts

    // filtra puntos de concentracion segun el termino de busqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPoints(concentrationPoints);
        } else {
            const filtered = concentrationPoints.filter(point => 
                point.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                point.direccion_fisica.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPoints(filtered);
        }
        // vuelve a la primera pagina al cambiar la busqueda
        setCurrentPage(1);
    }, [searchTerm, concentrationPoints]);

    // obtiene la direccion a partir de coordenadas
    useEffect(() => {
        const fetchAddress = async () => {
            if (!currentLocation) return;
            
            try {
                setIsLoadingAddress(true);
                const response = await fetch(
                    `https://drivup-backend.onrender.com/coordenadas-a-direccion?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}`
                );
                
                if (!response.ok) {
                    throw new Error('Error fetching address');
                }
                
                const data = await response.json();
                if (data.success) {
                    setAddressInfo({
                        direccion: data.direccion,
                        detallesDireccion: data.detallesDireccion
                    });
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            } finally {
                setIsLoadingAddress(false);
            }
        };
        
        if (currentLocation) {
            fetchAddress();
        }
    }, [currentLocation]);

    // devuelve los puntos paginados
    const getPaginatedPoints = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPoints.slice(startIndex, startIndex + itemsPerPage);
    };

    // maneja el cambio de tipo de ubicacion
    const handleLocationTypeChange = async (newType: string) => {
        // si la opcion esta deshabilitada, no permitir seleccion
        if (disabledOptions.includes(newType)) {
            return;
        }
        
        // Si es destino y el origen es un punto de concentración, forzar tipo 'manual'
        if (type === 'destination' && originIsCPHighlighted && newType !== 'manual') {
            return; // No permitir cambios a otros tipos cuando el origen es un punto de concentración
        }
        
        setLocationType(newType);
        
        // reinicia el punto seleccionado al cambiar el tipo de ubicacion
        if (newType !== 'hcp') {
            setSelectedPointId(null);
        }
        
        if (newType === 'current') {
            try {
                setLocationError(null);
                // solicita la ubicacion actual del navegador
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
                onLocationChange(type, `${coords.latitude},${coords.longitude}`, 'current');
                
                // Verificar si la ubicación actual es un punto de concentración
                if (type === 'origin') {
                    try {
                        const response = await fetch(
                            `https://drivup-backend.onrender.com/verificar-punto-concentracion?lat=${coords.latitude}&lon=${coords.longitude}`
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data.esPuntoConcentracion && onCurrentLocationIsCP) {
                                onCurrentLocationIsCP(data.puntoConcentracion);
                                
                                // Asegurar que la página se mantiene en la parte superior
                                setTimeout(() => {
                                    window.scrollTo(0, 0);
                                }, 100);
                            }
                        }
                    } catch (error) {
                        console.error('Error verificando si la ubicación actual es un punto de concentración:', error);
                    }
                }
            } catch (error) {
                setLocationError('No se pudo obtener tu ubicación. Por favor, verifica que hayas dado permiso de ubicación.');
                console.error('Error getting location:', error);
            }
        } else if (newType === 'manual') {
            // para entrada manual, solo notificamos el cambio de tipo
            if (manualAddress) {
                onLocationChange(type, '', 'manual');
            } else {
                onLocationChange(type, '', 'manual');
            }
        } else if (newType === 'hcp') {
            if (selectedPointId) {
                // si cambiamos a punto de concentracion y ya hay uno seleccionado, lo mantenemos
                const point = concentrationPoints.find(p => p.id === selectedPointId);
                if (point) {
                    onLocationChange(type, `${point.latitud},${point.longitud}`, 'hcp', point.id);
                }
            } else {
                // notificamos que estamos en modo hcp pero aun no hay punto seleccionado
                onLocationChange(type, '', 'hcp');
            }
        }
    };

    // maneja la seleccion de un punto de concentracion
    const handleSelectPoint = (point: ConcentrationPoint) => {
        setSelectedPointId(point.id);
        onLocationChange(type, `${point.latitud},${point.longitud}`, 'hcp', point.id);
        setLocationType('hcp');
    };

    // maneja el cambio de direccion manual
    const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setManualAddress(value);
        
        // usa la version con retraso para la conversion de direccion a coordenadas
        if (onManualAddressInput) {
            onManualAddressInput(type, value);
        } else {
            // comportamiento alternativo si no se proporciona version con retraso
            onLocationChange(type, value, 'manual');
        }
    };

    // maneja la busqueda de puntos de concentracion
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // determina las clases css para los botones segun su estado
    const getButtonClasses = (buttonType: string) => {
        const baseClasses = "px-6 py-3 rounded-full transition-all duration-200";
        const isDisabled = disabledOptions.includes(buttonType);
        const isSelected = locationType === buttonType;
        
        // Caso especial: Si es punto de concentración y estamos en origen con la bandera activada
        if (buttonType === 'hcp' && type === 'origin' && isCPHighlighted) {
            return `${baseClasses} bg-[#2D5DA1] text-white shadow-md`;
        }
        
        // Caso especial: Si es ubicación actual y estamos en origen con la bandera de CP activada
        if (buttonType === 'current' && type === 'origin' && isCPHighlighted) {
            return `${baseClasses} bg-[#2D5DA1] text-white shadow-md`;
        }
        
        // Caso especial: Si es dirección manual y estamos en destino y el origen es un punto de concentración
        if (buttonType === 'manual' && type === 'destination' && originIsCPHighlighted) {
            return `${baseClasses} bg-[#5AAA95] text-white shadow-md`;
        }
        
        if (isDisabled) {
            return `${baseClasses} bg-gray-200 text-gray-500 cursor-not-allowed`;
        }
        
        if (isSelected) {
            return `${baseClasses} ${
                type === 'origin' 
                ? 'bg-[#2D5DA1] text-white shadow-md' 
                : 'bg-[#5AAA95] text-white shadow-md'
            }`;
        }
        
        return `${baseClasses} bg-[#F8F9FA] text-[#4A4E69] hover:bg-[#2D5DA1]/10`;
    };

    // determina las clases css para las tarjetas de puntos segun su estado
    const getPointCardClasses = (pointId: number) => {
        const baseClasses = "p-4 border rounded-xl transition-all duration-200 cursor-pointer";
        
        if (selectedPointId === pointId) {
            return `${baseClasses} ${
                type === 'origin' 
                    ? 'border-[#2D5DA1] border-2 shadow-md bg-[#2D5DA1]/5' 
                    : 'border-[#5AAA95] border-2 shadow-md bg-[#5AAA95]/5'
            }`;
        }
        
        return `${baseClasses} border-gray-200 hover:border-${type === 'origin' ? '[#2D5DA1]' : '[#5AAA95]'}/70`;
    };

    return (
        <div className="p-8 border-b border-gray-100">
            {/* cabecera con icono y titulo */}
            <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${type === 'origin' ? 'bg-[#2D5DA1]/10' : 'bg-[#5AAA95]/10'} flex items-center justify-center mr-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${type === 'origin' ? 'text-[#2D5DA1]' : 'text-[#5AAA95]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#4A4E69]">{type === 'origin' ? 'Origen' : 'Destino'}</h2>
            </div>

            {/* botones para seleccionar tipo de ubicacion */}
            <div className="flex flex-wrap gap-3 mb-6">
                {type === 'origin' && (
                    <>
                        <button
                            className={getButtonClasses('current')}
                            onClick={() => handleLocationTypeChange('current')}
                            disabled={disabledOptions.includes('current')}
                        >
                            Mi ubicación actual
                        </button>
                        {locationError && locationType === 'current' && (
                            <div className="w-full mt-2 text-red-500 text-sm">
                                {locationError}
                            </div>
                        )}
                        {currentLocation && locationType === 'current' && (
                            <div className="w-full mt-2 ml-3 text-[#4A4E69] text-sm">
                                {isLoadingAddress ? (
                                    <span>Obteniendo dirección...</span>
                                ) : addressInfo ? (
                                    <>Ubicación actual: {addressInfo.direccion}</>
                                ) : (
                                    <>Ubicación actual: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</>
                                )}

                                {/* Mostrar información cuando es un punto de concentración */}
                                {type === 'origin' && isCPHighlighted && (
                                    <div className="mt-2 text-[#2D5DA1] bg-[#2D5DA1]/10 px-3 py-2 rounded-lg flex items-center font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Punto de concentración detectado: {
                                            detectedCPInfo?.nombre || 
                                            concentrationPoints.find(point => selectedPointId === point.id)?.nombre || 
                                            'Punto de concentración'
                                        }
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
                <button
                    className={getButtonClasses('manual')}
                    onClick={() => handleLocationTypeChange('manual')}
                    disabled={disabledOptions.includes('manual')}
                >
                    Dirección manual
                </button>
                <button
                    className={getButtonClasses('hcp')}
                    onClick={() => handleLocationTypeChange('hcp')}
                    disabled={disabledOptions.includes('hcp')}
                >
                    Punto de concentración
                </button>
            </div>

            {/* campo de entrada para direccion manual */}
            {(locationType === 'manual' || (type === 'destination' && originIsCPHighlighted)) && (
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Ingrese dirección de ${type === 'origin' ? 'origen' : 'destino'}`}
                        className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent transition-all duration-200"
                        value={manualAddress}
                        onChange={handleManualAddressChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4E69] absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            )}

            {/* seleccion de punto de concentracion */}
            {locationType === 'hcp' && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Buscar punto de concentración..."
                                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2D5DA1] focus:ring-2 focus:ring-[#2D5DA1]/20"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4A4E69]/60 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* lista de puntos de concentracion */}
                    <div className="space-y-3">
                        {getPaginatedPoints().map(point => (
                            <div 
                                key={point.id}
                                className={getPointCardClasses(point.id)}
                                onClick={() => handleSelectPoint(point)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-[#4A4E69]">{point.nombre}</h3>
                                        <p className="text-sm text-[#4A4E69]/60">{point.direccion_fisica}</p>
                                    </div>
                                    {selectedPointId === point.id && (
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${type === 'origin' ? 'bg-[#2D5DA1]' : 'bg-[#5AAA95]'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* paginacion */}
                    {filteredPoints.length > itemsPerPage && (
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-1">
                                Página {currentPage} de {Math.ceil(filteredPoints.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPoints.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(filteredPoints.length / itemsPerPage)}
                                className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}

                    {/* mensaje cuando no hay resultados */}
                    {filteredPoints.length === 0 && (
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