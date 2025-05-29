import { FaClock, FaDollarSign, FaRegCalendar, FaRoad, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ViajeItemProps } from "../../core/interfaces/viajesProps";

export function ViajeConductor(viaje:ViajeItemProps) {
  const navigate = useNavigate();
  let color: string="";
  let estado: string="";
  switch(viaje.estado) {
    case "aceptado_conductor":
      estado="Aceptado";
      color="green";
    break;
    case "cancelado_conductor":
      estado="Cancelado";
      color="red";
    break;
    default:
        estado="En proceso";
        color="blue";
  }
  return (
    <div
      className="flex flex-col sm:flex-row justify-between sm:items-center border p-4 rounded shadow-md bg-white"
    >
      {/* Lado izquierdo con info */}
      <div className="flex-1 mb-4 sm:mb-0">
        <h2 className="text-xl font-bold mb-2 text-[#2D5DA1]">
          {viaje.punto_concentracion}
        </h2>

        <div className="flex flex-wrap gap-4 max-sm:text-xs text-gray-700">
          <div className="flex items-center space-x-2">
            <FaClock className="text-[#F2B134]" />
            <span>{viaje.tiempo_estimado} min</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRoad className="text-[#F2B134]" />
            <span>{viaje.distancia_km} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-[#F2B134]" />
            <span>${viaje.ganancia_estimada}</span>
          </div>
          <div className="flex items-center space-x-2">
                      <FaRegCalendar className="text-[#F2B134]" />
                      <span>{new Date(viaje.updated_at).toLocaleDateString()}</span>
                    </div>
        </div>
      </div>

      {/* Botones y pasajeros en columna para móvil */}
      <div className="flex  items-center sm:flex-row gap-4 sm:items-center sm:justify-end sm:space-x-4 w-full sm:w-auto">
        {/* Botones */}
        <div className="max-sm:text-sm flex space-between gap-4 sm:flex-row sm:space-x-4  ">
            <div
              className={`px-4 p-2 rounded-md border-2 font-bold mx-auto ${
                color === "green"
                  ? "bg-green-300 border-green-600 text-green-600"
                  : "bg-red-300 border-red-600 text-red-600"
              }`}
            >
              <span className="max-sm:text-sm">{estado}</span>
            </div>
          <button
            className="max-sm:text-sm mx-auto max-sm:w-8/12 cursor-pointer px-4 py-2 bg-[#2D5DA1] text-white rounded hover:bg-[#244b85] transition hover:scale-105 sm:mb-0"
            onClick={() =>
              navigate(`/dashboard/conductor/detalle-viaje`, {
                state: {
                  id: viaje.id,
                  punto_concentracion: viaje.punto_concentracion,
                },
              })
            }
          >
            Ver detalles
          </button>
        </div>

        {/* Pasajeros */}
         <div className="max-sm:text-sm text-right mx-auto sm:text-left sm:border-l sm:pl-6">
          <p className="text-gray-500 text-sm">Pasajeros</p>
          <p className="text-2xl font-bold text-[#2D5DA1] flex items-center justify-end sm:justify-start">
            <FaUsers className="mr-2 text-[#F2B134]" />
            {viaje.cantidad_pasajeros}
          </p>
        </div>
      </div>
    </div>
  );
}
