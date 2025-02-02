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
        nombre: "Via 40 - Soledad 2000",
        empresa: "Coolitoral",
        tiempoPromedioViaje: 60,
        primerDespacho: "05:15 a.m",
        ultimoDespacho: "10:00 p.m",
        costo: 3300,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m48!1m12!1m3!1d62664.894021802174!2d-74.85796616408392!3d10.996856945989007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m33!3e0!4m3!3m2!1d10.967407999999999!2d-74.7747332!4m3!3m2!1d10.9847541!2d-74.809069!4m3!3m2!1d10.982267799999999!2d-74.81849609999999!4m3!3m2!1d11.0126678!2d-74.8233265!4m3!3m2!1d11.0199781!2d-74.8707149!4m3!3m2!1d11.0162614!2d-74.8132808!4m3!3m2!1d11.0258697!2d-74.8034662!4m3!3m2!1d10.9677837!2d-74.77478339999999!5e0!3m2!1ses-419!2ses!4v1504881238373",
        theme: {
            color: "bg-red-500",
            icon: "City",
            description: "Fast-paced urban adventure",
        },
        destinos: ["Las flores", "Via 40", "Centro", "Calle 17", "Simon Bolivar", "Plaza del sol", "Soledad 2000", "La nevada"],
    },
    {
        id: "2",
        nombre: "Via 40 - Villa carolina",
        empresa: "Coolitoral",
        tiempoPromedioViaje: 75,
        primerDespacho: "06:00 am",
        ultimoDespacho: "8:15 pm",
        costo: 3300,
        imageUrl: "/placeholder.svg?height=200&width=300",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m56!1m12!1m3!1d31333.495407481514!2d-74.81996410850496!3d10.986986849436063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m41!3e0!4m3!3m2!1d10.9672249!2d-74.7747703!4m3!3m2!1d10.9772935!2d-74.7798796!4m3!3m2!1d10.981408199999999!2d-74.7789361!4m3!3m2!1d10.9936627!2d-74.8135302!4m3!3m2!1d10.9909416!2d-74.8268837!4m3!3m2!1d11.006020099999999!2d-74.8245752!4m3!3m2!1d11.000992799999999!2d-74.8050853!4m3!3m2!1d10.9863568!2d-74.7919144!4m3!3m2!1d10.9837068!2d-74.7815945!4m3!3m2!1d10.967243199999999!2d-74.7749218!5e0!3m2!1ses-419!2ses!4v1504800524150",
        theme: {
            color: "bg-blue-500",
            icon: "Umbrella",
            description: "Relaxing coastal journey",
        },
        destinos: ["Villa carolina", "Via 40", "Centro", "Calle 17", "Simon Bolivar", "Plaza del sol", "Ciudad del puerto"],
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
            <div className="bg-green-700 text-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold sm:text-5xl md:text-6xl text-[#FCD116]">
                        Rutas Disponibles en la Plataforma
                    </h1>
                    <p className="mt-3 text-lg md:text-xl sm:mt-4 text-[#F5F5F5]">
                        Consulta aquí las rutas de buses que puedes solicitar a través de nuestra plataforma
                    </p>
                </div>
            </div>

            <div className='md:p-0 p-5 md:mt-0 -mt-9'>
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
        </HeaderFooter >
    );
};

export default Rutas;