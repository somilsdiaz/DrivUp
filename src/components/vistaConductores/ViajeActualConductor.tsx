import { useEffect, useState } from "react"
import { FaClock, FaRoad, FaDollarSign, FaUsers, FaMapMarkerAlt, FaPhoneAlt, FaUserAlt, FaArrowRight, FaRoute, FaCheckCircle, FaSpinner, } from "react-icons/fa"
import { getUserId } from "../../utils/auth"
import VisualizacionRuta from "../../components/visualizacionRuta"

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

const ViajeActualConductor = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viajeData, setViajeData] = useState<ViajeResponse | null>(null)

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
                                <p className="text-white/70 text-sm font-medium">Punto de Concentración</p>
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
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#5AAA95] to-[#5AAA95]/80 rounded-xl flex items-center justify-center">
                                        <FaUserAlt className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#4A4E69]">{pasajero.nombre_completo}</h4>
                                        <a
                                            href={`tel:${pasajero.telefono}`}
                                            className="flex items-center text-[#2D5DA1] hover:text-[#F2B134] transition-colors duration-200 text-sm font-medium"
                                        >
                                            <FaPhoneAlt className="mr-2" />
                                            {pasajero.telefono}
                                        </a>
                                    </div>
                                </div>

                                {/* Route Info */}
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <FaMapMarkerAlt className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#4A4E69]/60 font-medium">Recogida</p>
                                            <p className="text-sm font-semibold text-[#4A4E69]">Orden #{pasajero.orden_recogida}</p>
                                        </div>
                                    </div>

                                    <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-green-500 rounded-full"></div>

                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FaArrowRight className="text-green-500 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#4A4E69]/60 font-medium">Entrega</p>
                                            <p className="text-sm font-semibold text-[#4A4E69]">Orden #{pasajero.orden_entrega}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Fare */}
                                <div className="bg-gradient-to-r from-[#F2B134] to-[#F2B134]/90 text-white px-4 py-3 rounded-xl text-center min-w-[120px]">
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
            </div>
        </div>
    )
}

export default ViajeActualConductor
