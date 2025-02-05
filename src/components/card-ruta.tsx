import { Bus, Umbrella, Mountain, MapPin as City } from "lucide-react";
import { useState } from "react";

type BusRoute = {
    id: string
    nombre: string
    empresa: "Sobusa" | "Coolitoral" | "Carolina" | "Transmetro"
    tiempoPromedioViaje: number
    primerDespacho: string
    ultimoDespacho: string
    costo: number
    imageUrl: string
    mapUrl: string
    theme: {
        color: string
        icon: string
        description: string
    }
    destinos: string[]
}


const icons = {
    Bus,
    Umbrella,
    Mountain,
    City,
};

interface BusRouteCardProps {
    route: BusRoute;
}


export function BusRouteCard({ route }: BusRouteCardProps) {
    const Icon = icons[route.theme.icon as keyof typeof icons];
    // Estados de carga para la imagen y el mapa
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    return (
        <div className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg border md:border-gray-200 border-gray-400 rounded-lg flex flex-col h-full">
            {/* Barra superior con color temático */}
            <div className={`${route.theme.color} h-2`} />

            {/* Encabezado de la tarjeta */}
            <div className="relative flex-shrink-0">
                {/* Skeleton para la imagen */}
                {!isImageLoaded && (
                    <div className="flex justify-center items-center h-52 skeleton skeleton-image">
                        <div className="loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}
                <img
                    src={route.imageUrl || "/placeholder.svg"}
                    alt={`${route.nombre} route`}
                    className={`w-full h-52 object-cover rounded-t-lg ${isImageLoaded ? "" : "hidden"}`}
                    onLoad={() => setIsImageLoaded(true)} // Marcar como cargada cuando termine
                />
                {/* Badge de la compañía */}
                <div className="absolute top-2 right-2">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {route.empresa}
                    </span>
                </div>
                {/* Ícono temático */}
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 rounded-full p-2">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Título y descripción */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">{route.nombre}</h2>
                    <p className="text-sm text-gray-600">{route.theme.description}</p>
                </div>

                {/* Detalles de la ruta */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="font-semibold">Tiempo promedio de viaje</p>
                        <p>{route.tiempoPromedioViaje} minutos</p>
                    </div>
                    <div>
                        <p className="font-semibold">Costo del pasaje</p>
                        <p>$ {route.costo.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Primer despacho</p>
                        <p>{route.primerDespacho}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ultimo despacho</p>
                        <p>{route.ultimoDespacho}</p>
                    </div>
                </div>

                {/* Destinos */}
                <div className="mb-4">
                    <p className="font-semibold mb-2">Destinos</p>
                    <div className="flex flex-wrap gap-2">
                        {route.destinos.map((destinos) => (
                            <span
                                key={destinos}
                                className="bg-white border border-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            >
                                {destinos}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Contenedor del mapa */}
                <div className="w-full mt-auto">
                    {/* Skeleton para el mapa */}
                    {!isMapLoaded && (
                        <div className="flex justify-center items-center h-52 skeleton skeleton-image">
                            <div className="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    )}

                    {/* Mapa */}
                    <iframe
                        src={route.mapUrl}
                        width="100%"
                        height="300"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setIsMapLoaded(true)}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}