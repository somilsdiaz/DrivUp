import HeaderFooterConductores from "../../layouts/headerFooterConductores";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { List } from "lucide-react";

const ListaPasajeros = () => {
    return (
        <HeaderFooterConductores>
            <div className="flex flex-col md:flex-row p-6 gap-6">
                {/* Sección izquierda: Detalles del conductor */}
                <div className="flex-1 bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-[#4A4E69] mb-4">Detalles del Conductor</h2>
                    {/* Aquí van los detalles del conductor */}
                    <p>Nombre: Juan Pérez</p>
                    <p>Ruta: Bogotá - Medellín</p>
                    <p>Vehículo: Toyota Hilux</p>
                </div>

                {/* Sección derecha: Aside Panel */}
                <aside className="w-full md:w-80 bg-[#FFC300] rounded-xl shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-white mb-2">¿Buscas pasajeros para programar viajes?</h3>
                    <p className="text-sm text-white mb-4">Encuentra aqui los pasajeros que mas se adapten a tus preferencias de viajes</p>
                    <button className="bg-[#F2B134] text-[#4A4E69] px-4 py-2 rounded hover:bg-green-600">
                        ¡Haz click aqui!
                    </button>
                </aside>
            </div>
        </HeaderFooterConductores>
    );
};

export default ListaPasajeros;
