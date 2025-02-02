import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { useState } from "react";
import { Search } from "lucide-react";
import { BusRouteCard } from '../components/card-ruta';

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

const busRoutes: BusRoute[] = [
    {
        id: "1",
        nombre: "Downtown Express",
        empresa: "Sobusa",
        tiempoPromedioViaje: 30,
        primerDespacho: "05:00",
        ultimoDespacho: "23:00",
        costo: 2.5,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "/placeholder.svg?height=200&width=300",
        theme: {
            color: "bg-red-500",
            icon: "City",
            description: "Fast-paced urban adventure",
        },
        destinos: ["Centro Comercial", "Plaza Principal", "Estación Central"],
    },
    {
        id: "2",
        nombre: "Beach Line",
        empresa: "Coolitoral",
        tiempoPromedioViaje: 45,
        primerDespacho: "06:00",
        ultimoDespacho: "22:00",
        costo: 3.0,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "/placeholder.svg?height=200&width=300",
        theme: {
            color: "bg-blue-500",
            icon: "Umbrella",
            description: "Relaxing coastal journey",
        },
        destinos: ["Playa Norte", "Malecón", "Zona Hotelera"],
    },
    {
        id: "3",
        nombre: "Mountain Route",
        empresa: "Carolina",
        tiempoPromedioViaje: 60,
        primerDespacho: "07:00",
        ultimoDespacho: "21:00",
        costo: 3.5,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "/placeholder.svg?height=200&width=300",
        theme: {
            color: "bg-green-500",
            icon: "Mountain",
            description: "Scenic mountain exploration",
        },
        destinos: ["Mirador", "Parque Nacional", "Cascada"],
    },
    {
        id: "4",
        nombre: "City Circle",
        empresa: "Transmetro",
        tiempoPromedioViaje: 40,
        primerDespacho: "05:30",
        ultimoDespacho: "23:30",
        costo: 2.75,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "/placeholder.svg?height=200&width=300",
        theme: {
            color: "bg-purple-500",
            icon: "Bus",
            description: "Comprehensive city tour",
        },
        destinos: ["Museo", "Teatro", "Zona Histórica"],
    },
];

const Rutas: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRoutes = busRoutes.filter(
        (route) =>
            (selectedCompany ? route.empresa === selectedCompany : true) &&
            route.destinos.some((destino) =>
                destino.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
    );

    return (
        <HeaderFooter>
            <div className='md:p-0 p-5'>
                <div className="container mx-auto py-12">
                    {/* Filtros de búsqueda y selección */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        {/* Barra de búsqueda */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar ruta..."
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selector de compañía */}
                        <select
                            className="w-full sm:w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                                setSelectedCompany(e.target.value === "all" ? null : e.target.value)
                            }
                        >
                            <option value="all">Todos</option>
                            <option value="Sobusa">Sobusa</option>
                            <option value="Coolitoral">Coolitoral</option>
                            <option value="Carolina">Carolina</option>
                            <option value="Transmetro">Transmetro</option>
                        </select>
                    </div>

                    {/* Lista de rutas filtradas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRoutes.map((route) => (
                            <BusRouteCard key={route.id} route={route} />
                        ))}
                    </div>
                </div>
            </div>
        </HeaderFooter>
    );
};

export default Rutas;