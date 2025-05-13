import { useEffect, useState } from "react";
import { FaClock, FaRoad, FaDollarSign, FaUsers } from "react-icons/fa";
import HeaderFooterConductores from "../../layouts/headerFooterConductores";

type Viaje = {
  id: number;
  punto_concentracion: string;
  tiempo_estimado: string;
  distancia_km: number;
  ganancia_estimada: number;
  cantidad_pasajeros: number;
};

const ListaViajes = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);

  useEffect(() => {
    // Simulación de datos mientras se desarrolla el backend
    const viajesSimulados: Viaje[] = [
      {
        id: 1,
        punto_concentracion: "Centro Comercial Buenavista",
        tiempo_estimado: "15 min",
        distancia_km: 5.2,
        ganancia_estimada: 8500,
        cantidad_pasajeros: 3,
      },
      {
        id: 2,
        punto_concentracion: "Parque de los Novios",
        tiempo_estimado: "20 min",
        distancia_km: 7.8,
        ganancia_estimada: 9500,
        cantidad_pasajeros: 2,
      },
      {
        id: 3,
        punto_concentracion: "Universidad del Norte",
        tiempo_estimado: "12 min",
        distancia_km: 3.5,
        ganancia_estimada: 7200,
        cantidad_pasajeros: 4,
      },
    ];

    setViajes(viajesSimulados);

    // Código original para cuando se conecte al backend:
    /*
    const fetchViajes = async () => {
      try {
        const res = await fetch("https://drivup-backend.onrender.com/viajes-sugeridos/45");
        const data = await res.json();
        setViajes(data);
      } catch (error) {
        console.error("Error al obtener viajes", error);
      }
    };

    fetchViajes();
    */
  }, []);

  return (
    <HeaderFooterConductores>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Ofertas Cercanas</h1>

        <div className="grid gap-4">
          {viajes.map((viaje) => (
            <div
              key={viaje.id}
              className="flex justify-between items-center border p-4 rounded shadow-md bg-white"
            >
              {/* Lado izquierdo con info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-[#2D5DA1]">
                  {viaje.punto_concentracion}
                </h2>

                <div className="flex space-x-6 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-[#F2B134]" />
                    <span>{viaje.tiempo_estimado}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRoad className="text-[#F2B134]" />
                    <span>{viaje.distancia_km} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDollarSign className="text-[#F2B134]" />
                    <span>${viaje.ganancia_estimada}</span>
                  </div>
                </div>
              </div>

              {/* Lado derecho: Pasajeros */}
              <div className="text-right ml-6 border-l pl-6">
                <p className="text-gray-500 text-sm">Pasajeros</p>
                <p className="text-2xl font-bold text-[#2D5DA1] flex items-center justify-end">
                  <FaUsers className="mr-2 text-[#F2B134]" />
                  {viaje.cantidad_pasajeros}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HeaderFooterConductores>
  );
};

export default ListaViajes;