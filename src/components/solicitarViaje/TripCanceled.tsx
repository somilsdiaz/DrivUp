import { FaSadTear } from 'react-icons/fa';

interface TripCanceledProps {
    driverInfo?: {
        id?: number;
        nombre?: string;
        vehiculo?: string;
        placa?: string;
        foto?: string;
    };
    onReset: () => void;
}

const TripCanceled = ({ driverInfo, onReset }: TripCanceledProps) => {
    return (
        <div className="p-8">
            {/* Sección de mensaje de cancelación */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSadTear className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">Viaje Cancelado</h2>
                <p className="text-xl text-[#4A4E69]/80">
                    El conductor ha cancelado este viaje
                </p>
            </div>

            {/* Información del conductor que canceló (si está disponible) */}
            {driverInfo && (
                <div className="bg-[#F8F9FA] p-8 rounded-xl mb-8">
                    <div className="flex items-center mb-6">
                        <img
                            src={driverInfo.foto || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt="Conductor"
                            className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                        />
                        <div>
                            <p className="text-2xl font-bold text-[#4A4E69]">{driverInfo.nombre || 'Conductor'}</p>
                            <p className="text-[#4A4E69]/60">{driverInfo.vehiculo || 'Vehículo no especificado'}</p>
                            <p className="text-[#4A4E69]/60">Placa: {driverInfo.placa || 'No disponible'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de instrucción */}
            <div className="bg-[#F8F9FA] p-6 rounded-xl mb-8 text-center">
                <p className="text-[#4A4E69]">
                    Lamentamos el inconveniente. Puedes solicitar un nuevo viaje o intentarlo más tarde.
                </p>
            </div>

            {/* Botón para solicitar nuevo viaje */}
            <button
                className="w-full bg-[#5AAA95] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#5AAA95]/90 transition-all duration-200"
                onClick={onReset}
            >
                Solicitar Nuevo Viaje
            </button>
        </div>
    );
};

export default TripCanceled; 