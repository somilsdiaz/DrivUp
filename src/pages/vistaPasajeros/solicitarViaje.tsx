import { useState } from 'react';
import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";

const SolicitarViaje = () => {
    const [originType, setOriginType] = useState('current');
    const [destinationType, setDestinationType] = useState('hcp'); // hcp = high concentration point
    const [selectedHcp, setSelectedHcp] = useState<string | null>(null);
    const [manualAddress, setManualAddress] = useState('');
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [rideAccepted, setRideAccepted] = useState(false);

    // Mock data
    const highConcentrationPoints = [
        { id: 1, name: 'Universidad del Norte', address: 'Km.5 Vía Puerto Colombia' },
        { id: 2, name: 'Estadio Romelio Martinez', address: 'Calle 72 #46-20' },
        { id: 3, name: 'Centro Comercial Buenavista', address: 'Cra. 53 #98-2 a 98-150' },
    ];

    const rideEstimation = {
        distance: '12.5 km',
        duration: '25 min',
        price: '$15,000 COP',
    };

    const driverInfo = {
        name: 'Carlos Rodriguez',
        rating: 4.8,
        vehicle: 'Chevrolet Spark',
        plate: 'ABC123',
        eta: '5 min',
        arrivalTime: '35 min',
    };

    const handleSubmitRequest = () => {
        setRequestSubmitted(true);
        // Simulate ride acceptance after 3 seconds
        setTimeout(() => setRideAccepted(true), 3000);
    };

    const handleCancelRequest = () => {
        setRequestSubmitted(false);
        setRideAccepted(false);
    };

    return (
        <HeaderFooterPasajeros>
            <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Solicitar Viaje</h1>

                {!requestSubmitted ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Origin Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Origen</h2>
                            <div className="flex mb-2">
                                <button
                                    className={`px-4 py-2 mr-2 rounded-md ${originType === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setOriginType('current')}
                                >
                                    Mi ubicación actual
                                </button>
                                <button
                                    className={`px-4 py-2 mr-2 rounded-md ${originType === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setOriginType('manual')}
                                >
                                    Dirección manual
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md ${originType === 'hcp' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setOriginType('hcp')}
                                >
                                    Punto de concentración
                                </button>
                            </div>

                            {originType === 'manual' && (
                                <input
                                    type="text"
                                    placeholder="Ingrese dirección de origen"
                                    className="w-full p-2 border rounded-md"
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                />
                            )}

                            {originType === 'hcp' && (
                                <select
                                    className="w-full p-2 border rounded-md"
                                    onChange={(e) => setSelectedHcp(e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Seleccione un punto de concentración</option>
                                    {highConcentrationPoints.map(point => (
                                        <option key={point.id} value={point.id}>{point.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Destination Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Destino</h2>
                            <div className="flex mb-2">
                                <button
                                    className={`px-4 py-2 mr-2 rounded-md ${destinationType === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setDestinationType('manual')}
                                >
                                    Dirección manual
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md ${destinationType === 'hcp' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setDestinationType('hcp')}
                                >
                                    Punto de concentración
                                </button>
                            </div>

                            {destinationType === 'manual' && (
                                <input
                                    type="text"
                                    placeholder="Ingrese dirección de destino"
                                    className="w-full p-2 border rounded-md"
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                />
                            )}

                            {destinationType === 'hcp' && (
                                <select
                                    className="w-full p-2 border rounded-md"
                                    onChange={(e) => setSelectedHcp(e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Seleccione un punto de concentración</option>
                                    {highConcentrationPoints.map(point => (
                                        <option key={point.id} value={point.id}>{point.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Map Preview - This would be replaced with an actual map component */}
                        <div className="h-64 bg-gray-200 rounded-md mb-6 flex items-center justify-center">
                            <span className="text-gray-500">Mapa con ruta prevista</span>
                        </div>

                        {/* Ride Estimation */}
                        <div className="mb-6 flex justify-between bg-gray-100 p-4 rounded-md">
                            <div>
                                <p className="font-semibold">Distancia:</p>
                                <p>{rideEstimation.distance}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tiempo estimado:</p>
                                <p>{rideEstimation.duration}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Precio aproximado:</p>
                                <p>{rideEstimation.price}</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold"
                            onClick={handleSubmitRequest}
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {!rideAccepted ? (
                            // Waiting for driver
                            <div className="text-center">
                                <div className="mb-4">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Tu solicitud ha sido enviada</h2>
                                <p className="text-gray-600 mb-6">Te avisaremos cuando un conductor acepte tu solicitud</p>

                                {/* Map Preview */}
                                <div className="h-64 bg-gray-200 rounded-md mb-6 flex items-center justify-center">
                                    <span className="text-gray-500">Mapa con ruta prevista</span>
                                </div>

                                <button
                                    className="w-full bg-red-500 text-white py-3 rounded-md font-semibold"
                                    onClick={handleCancelRequest}
                                >
                                    Cancelar Solicitud
                                </button>
                            </div>
                        ) : (
                            // Driver accepted
                            <div>
                                <div className="mb-6 text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold">¡Pronto te recogerán!</h2>
                                </div>

                                {/* Driver Info */}
                                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                        <div>
                                            <p className="font-semibold">{driverInfo.name}</p>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                                <span className="ml-1">{driverInfo.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Vehículo</p>
                                            <p>{driverInfo.vehicle}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Placa</p>
                                            <p>{driverInfo.plate}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tiempo de llegada</p>
                                            <p>{driverInfo.eta}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Llegada a destino</p>
                                            <p>{driverInfo.arrivalTime}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map with route */}
                                <div className="h-64 bg-gray-200 rounded-md mb-6 flex items-center justify-center">
                                    <span className="text-gray-500">Mapa con ruta final</span>
                                </div>

                                <button
                                    className="w-full bg-red-500 text-white py-3 rounded-md font-semibold"
                                    onClick={handleCancelRequest}
                                >
                                    Cancelar Viaje
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </HeaderFooterPasajeros>
    );
};

export default SolicitarViaje;
