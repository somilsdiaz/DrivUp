import { useEffect, useState } from "react"
import { FaClock, FaRoad, FaDollarSign, FaUsers, FaMapMarkerAlt, FaPhoneAlt, FaUserAlt, FaArrowRight, FaRoute, FaCheckCircle, FaSpinner, } from "react-icons/fa"
import { getUserId } from "../../utils/auth"
import VisualizacionRuta from "../../components/visualizacionRuta"
import ModalMessage from "../../components/skeletons/ModalMessage"

type PuntoConcentracion = {
    id: number
    nombre: string
    latitud: string
    longitud: string
}

type Pasajero = {
    id: number
    nombre_completo: string
    nombre: string
    segundo_nombre: string
    apellido: string
    segundo_apellido: string
    telefono: string
    origen: {
        latitud: string
        longitud: string
    }
    destino: {
        latitud: string
        longitud: string
    }
    orden_recogida: number
    orden_entrega: number
    tarifa: string
}

type ViajeDetalle = {
    id: number
    punto_concentracion: PuntoConcentracion
    pmcp_es_origen: boolean
    distancia_km: string
    tiempo_estimado_min: number
    ganancia_estimada_conductor: string
    numero_pasajeros_total: number
    estado: string
}

type ViajeResponse = {
    viaje: ViajeDetalle
    pasajeros: Pasajero[]
}

type PasajeroEstado = {
    solicitud_id: number
    pasajero_id: number
    nombre_completo: string
    estado: string
}

type EstadoViajeResponse = {
    success: boolean
    viaje_id: number
    conductor_id: number
    pasajeros: PasajeroEstado[]
}

const ViajeActualConductor = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viajeData, setViajeData] = useState<ViajeResponse | null>(null)
    const [cancelingViaje, setCancelingViaje] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState<"success" | "error" | "info">("info")
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [estadoPasajerosModalOpen, setEstadoPasajerosModalOpen] = useState(false)
    const [estadoPasajeros, setEstadoPasajeros] = useState<EstadoViajeResponse | null>(null)
    const [loadingEstado, setLoadingEstado] = useState(false)

    const handleCancelarViaje = async () => {
        if (!viajeData) return
        setConfirmModalOpen(true)
    }
    
    const confirmCancelarViaje = async () => {
        if (!viajeData) return
        
        try {
            setCancelingViaje(true)
            const userId = getUserId()
            if (!userId) {
                throw new Error("No se encontró ID de usuario")
            }
            
            const response = await fetch('http://localhost:5000/cancelar-viaje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    viaje_id: viajeData.viaje.id,
                    user_id: userId
                })
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "No se pudo cancelar el viaje")
            }
            
            await response.json()
            setModalMessage('El viaje ha sido cancelado exitosamente')
            setModalType('success')
            setModalOpen(true)            
        } catch (err) {
            console.error("Error al cancelar el viaje:", err)
            setModalMessage("Error al cancelar el viaje: " + (err instanceof Error ? err.message : "Error desconocido"))
            setModalType('error')
            setModalOpen(true)
        } finally {
            setCancelingViaje(false)
        }
    }
    
    const fetchEstadoPasajeros = async () => {
        setLoadingEstado(true)
        try {
            const userId = getUserId()
            if (!userId) {
                throw new Error("No se encontró ID de usuario")
            }
            
            const response = await fetch(`http://localhost:5000/conductor/estado-viaje/${userId}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "No se pudo obtener el estado de los pasajeros")
            }
            
            const data = await response.json()
            setEstadoPasajeros(data)
            setEstadoPasajerosModalOpen(true)
        } catch (err) {
            console.error("Error al obtener estado de los pasajeros:", err)
            setModalMessage("Error al obtener estado de los pasajeros: " + (err instanceof Error ? err.message : "Error desconocido"))
            setModalType('error')
            setModalOpen(true)
        } finally {
            setLoadingEstado(false)
        }
    }
    
    const completarViaje = async () => {
        if (!viajeData || !estadoPasajeros) return
        
        try {
            const userId = getUserId()
            if (!userId) {
                throw new Error("No se encontró ID de usuario")
            }
            
            // Aquí iría la llamada a la API para completar el viaje
            console.log('Viaje completado con ID:', viajeData.viaje.id)
            
            setEstadoPasajerosModalOpen(false)
            setModalMessage('El viaje ha sido completado exitosamente')
            setModalType('success')
            setModalOpen(true)
        } catch (err) {
            console.error("Error al completar el viaje:", err)
            setModalMessage("Error al completar el viaje: " + (err instanceof Error ? err.message : "Error desconocido"))
            setModalType('error')
            setModalOpen(true)
        }
    }
    
    const handleCloseModal = () => {
        setModalOpen(false)
        if (modalType === 'success') {
            window.location.reload()
        }
    }
    
    const handleCancelConfirmation = () => {
        setConfirmModalOpen(false)
    }

    const handleConfirmCancelacion = () => {
        setConfirmModalOpen(false)
        confirmCancelarViaje();
    }

    useEffect(() => {
        const fetchViajeActual = async () => {
            setLoading(true)
            try {
                const userId = getUserId()
                if (!userId) {
                    setError("No se encontró ID de usuario")
                    return
                }

                const response = await fetch(`http://localhost:5000/detalles-viaje-conductor?user_id=${userId}`)
                if (!response.ok) {
                    throw new Error("Error al obtener detalles del viaje")
                }

                const data = await response.json()
                setViajeData(data)
            } catch (err) {
                console.error("Error obteniendo detalles del viaje:", err)
                setError("No se pudo cargar la información del viaje actual")
            } finally {
                setLoading(false)
            }
        }

        fetchViajeActual()
    }, [])

    // Verificar si todos los pasajeros han completado su viaje
    const todosPasajerosCompletados = estadoPasajeros?.pasajeros.every(p => p.estado === 'completado') || false

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-white rounded-2xl">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#F2B134] border-t-transparent rounded-full animate-spin"></div>
                    <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2D5DA1] text-xl animate-pulse" />
                </div>
                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold text-[#4A4E69] mb-2">Cargando detalles del viaje</h3>
                    <p className="text-[#4A4E69]/70">Obteniendo información actualizada...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-8 border-red-500 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">!</span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-red-800">Error al cargar</h3>
                        <p className="text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!viajeData) {
        return (
            <div className="bg-gradient-to-br from-[#F8F9FA] to-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-[#2D5DA1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRoute className="text-[#2D5DA1] text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#4A4E69] mb-2">Sin viajes asignados</h3>
                <p className="text-[#4A4E69]/70">No hay viajes activos en este momento.</p>
            </div>
        )
    }

    const { viaje, pasajeros } = viajeData
    const pasajerosOrdenados = [...pasajeros].sort((a, b) => a.orden_recogida - b.orden_recogida)

    return (
        <div className="space-y-6">
            {/* mensaje modal para resultados */}
            <ModalMessage 
                isOpen={modalOpen}
                onClose={handleCloseModal}
                message={modalMessage}
                type={modalType}
                autoClose={true}
                autoCloseTime={3000}
            />
            
            {/* mensaje modal para confirmacion */}
            <ModalMessage 
                isOpen={confirmModalOpen}
                onClose={handleConfirmCancelacion}
                onCancel={handleCancelConfirmation}
                showCancelButton={true}
                confirmText="Sí, cancelar"
                cancelText="No, mantener viaje"
                message={'¿Está seguro que desea cancelar este viaje? Esta acción no se puede deshacer.'}
                type={"info"}
                autoClose={false}
            />
            
            {/* Modal para mostrar estado de pasajeros */}
            {estadoPasajerosModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <FaUsers className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold">Estado de Pasajeros</h3>
                                </div>
                                <button 
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    onClick={() => setEstadoPasajerosModalOpen(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {loadingEstado ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-12 h-12 border-4 border-[#F2B134] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-[#4A4E69]">Cargando estado de pasajeros...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <p className="text-[#4A4E69]/70 text-sm mb-2">Información del estado actual de todos los pasajeros en el viaje</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="text-sm text-[#4A4E69]">Completado</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                <span className="text-sm text-[#4A4E69]">No completado</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {estadoPasajeros?.pasajeros.map((pasajero) => (
                                            <div 
                                                key={pasajero.solicitud_id} 
                                                className="bg-gradient-to-r from-[#F8F9FA] to-white rounded-xl p-4 border border-gray-100"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                            pasajero.estado === 'completado' ? 'bg-green-100' : 'bg-amber-100'
                                                        }`}>
                                                            <FaUserAlt className={
                                                                pasajero.estado === 'completado' ? 'text-green-600' : 'text-amber-600'
                                                            } />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-[#4A4E69]">{pasajero.nombre_completo}</h4>
                                                            <p className="text-xs text-[#4A4E69]/60">ID: {pasajero.pasajero_id}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full ${
                                                        pasajero.estado === 'completado' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {pasajero.estado === 'completado' ? 'Completado' : 'No completado'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                            <div className="flex space-x-4">
                                <button
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                                    onClick={() => setEstadoPasajerosModalOpen(false)}
                                >
                                    Cerrar
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl transition-colors flex items-center ${
                                        todosPasajerosCompletados
                                            ? 'bg-[#5AAA95] hover:bg-[#4a9a85] text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={todosPasajerosCompletados ? completarViaje : undefined}
                                    disabled={!todosPasajerosCompletados}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Marcar viaje como completado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="relative overflow-hidden bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <FaRoute className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Viaje en Curso</h2>
                                <p className="text-white/80 text-sm">Estado activo</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#5AAA95] px-4 py-2 rounded-full">
                            <FaCheckCircle className="text-white text-sm" />
                            <span className="text-white text-sm font-medium">Activo</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#F2B134] rounded-lg flex items-center justify-center">
                                <FaMapMarkerAlt className="text-white" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm font-medium">
                                    Punto de Concentración {viaje.pmcp_es_origen ? "(Origen)" : "(Destino)"}
                                </p>
                                <p className="text-white text-lg font-semibold">{viaje.punto_concentracion.nombre}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#F2B134] to-[#F2B134]/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FaClock className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-[#4A4E69]/60 text-sm font-medium">Tiempo Estimado</p>
                            <p className="text-[#4A4E69] text-2xl font-bold">{viaje.tiempo_estimado_min}</p>
                            <p className="text-[#4A4E69]/60 text-xs">minutos</p>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#5AAA95] to-[#5AAA95]/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FaRoad className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-[#4A4E69]/60 text-sm font-medium">Distancia Total</p>
                            <p className="text-[#4A4E69] text-2xl font-bold">{viaje.distancia_km}</p>
                            <p className="text-[#4A4E69]/60 text-xs">kilómetros</p>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#12CBC4] to-[#12CBC4]/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FaDollarSign className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-[#4A4E69]/60 text-sm font-medium">Ganancia Estimada</p>
                            <p className="text-[#4A4E69] text-2xl font-bold">
                                ${Intl.NumberFormat("es-CO").format(Number(viaje.ganancia_estimada_conductor))}
                            </p>
                            <p className="text-[#4A4E69]/60 text-xs">pesos colombianos</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Visualization of the route */}
            <div className="relative z-0 flex justify-center bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                {viajeData && <VisualizacionRuta viajeId={viaje.id} />}
            </div>
            {/* Passengers Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F8F9FA] to-white p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#2D5DA1] rounded-xl flex items-center justify-center">
                                <FaUsers className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#4A4E69]">Lista de Pasajeros</h3>
                                <p className="text-[#4A4E69]/60 text-sm">Total: {pasajeros.length} pasajeros</p>
                            </div>
                        </div>
                        <div className="bg-[#F2B134] text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {pasajeros.length} de {viaje.numero_pasajeros_total}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {pasajerosOrdenados.map((pasajero, index) => (
                        <div
                            key={pasajero.id}
                            className="group relative bg-gradient-to-r from-[#F8F9FA] to-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#2D5DA1] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                {index + 1}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                {/* Passenger Info */}
                                <div className="flex items-center space-x-4 lg:w-1/3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#5AAA95] to-[#5AAA95]/80 rounded-xl flex items-center justify-center">
                                        <FaUserAlt className="text-white" />
                                    </div>
                                    <div className="truncate">
                                        <h4 className="text-lg font-semibold text-[#4A4E69] truncate">{pasajero.nombre_completo}</h4>
                                        <a
                                            href={`tel:${pasajero.telefono}`}
                                            className="flex items-center text-[#2D5DA1] hover:text-[#F2B134] transition-colors duration-200 text-sm font-medium"
                                        >
                                            <FaPhoneAlt className="mr-2 flex-shrink-0" />
                                            <span className="truncate">{pasajero.telefono}</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Route Info */}
                                <div className="flex items-center space-x-6 lg:w-1/3 justify-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaMapMarkerAlt className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#4A4E69]/60 font-medium">Recogida</p>
                                            <p className="text-sm font-semibold text-[#4A4E69]">Orden #{pasajero.orden_recogida}</p>
                                        </div>
                                    </div>

                                    <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex-shrink-0"></div>

                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaArrowRight className="text-green-500 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#4A4E69]/60 font-medium">Entrega</p>
                                            <p className="text-sm font-semibold text-[#4A4E69]">Orden #{pasajero.orden_entrega}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Fare */}
                                <div className="bg-gradient-to-r from-[#F2B134] to-[#F2B134]/90 text-white px-4 py-3 rounded-xl text-center lg:w-1/6 flex-shrink-0">
                                    <p className="text-xs font-medium opacity-90">Tarifa</p>
                                    <p className="text-lg font-bold">${Intl.NumberFormat("es-CO").format(Number(pasajero.tarifa))}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold mb-1">Resumen del Viaje</h4>
                        <p className="text-white/80 text-sm">Información consolidada del recorrido</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm">Total Estimado</p>
                        <p className="text-2xl font-bold">
                            ${Intl.NumberFormat("es-CO").format(Number(viaje.ganancia_estimada_conductor))}
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                        onClick={handleCancelarViaje}
                        disabled={cancelingViaje}
                    >
                        {cancelingViaje ? (
                            <>
                                <FaSpinner className="h-5 w-5 mr-2 animate-spin" />
                                Cancelando...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar viaje
                            </>
                        )}
                    </button>
                    
                    <button
                        className="flex items-center justify-center bg-[#5AAA95] hover:bg-[#4a9a85] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
                        onClick={fetchEstadoPasajeros}
                        disabled={loadingEstado}
                    >
                        {loadingEstado ? (
                            <>
                                <FaSpinner className="h-5 w-5 mr-2 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Marcar viaje como completado
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViajeActualConductor
