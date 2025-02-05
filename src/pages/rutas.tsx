import React, { useEffect, useState } from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { Search } from "lucide-react";
import { BusRouteCard } from '../components/card-ruta';
import ModernSkeletonLoader from '../components/cardNewsSkeleton/CardNewsSkeletonLoader';

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



const Rutas: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Obtener las rutas desde el backend
    useEffect(() => {
        const fetchBusRoutes = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://unibus-backend.onrender.com/rutas');
                if (!response.ok) {
                    throw new Error('Error al obtener las rutas');
                }
                const data = await response.json();
                setBusRoutes(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusRoutes();
    }, []);

    // Filtrar las rutas según la compañía y el término de búsqueda
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
                    {isLoading ? (                     // Mostrar 3 skeletons mientras carga
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <ModernSkeletonLoader key={index} />
                            ))}
                        </div>
                    ) : (
                        < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRoutes.length > 0 ? (
                                filteredRoutes.map((route) => (
                                    <BusRouteCard key={route.id} route={route} />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                    {/* Icono o ilustración (opcional) */}
                                    <svg
                                        className="w-24 h-24 text-gray-400 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                        No se encontraron rutas
                                    </h2>
                                    <p className="text-gray-600 max-w-md">
                                        Lo sentimos, no hemos encontrado rutas que coincidan con tu búsqueda. Por favor, intenta con otros filtros o verifica nuevamente más tarde.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeaderFooter >
    );
};

export default Rutas;