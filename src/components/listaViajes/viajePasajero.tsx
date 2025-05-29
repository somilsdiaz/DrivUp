import { FaClock, FaDollarSign, FaRoad, FaUsers,FaRegCalendar } from "react-icons/fa";
import { ViajeItemProps } from "../../core/interfaces/viajesProps";
import { useState } from "react";
import { DetalleConductorModal } from "./detalleConductorModal";
import { useGetConductorUserId } from "../../hooks/useGetConductorUserId";



export function ViajePasajero(viaje:ViajeItemProps) {
 const [showModal, setShowModal] = useState(false);
 const { data:conductor} = useGetConductorUserId(viaje.conductor_id);


 if(!conductor){
     return <div>No se encontró el conductor</div>
 }

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
        estado="disponible";
        color="blue";
  }
  return (
    <div
      className="flex flex-col sm:flex-row justify-between sm:items-center border p-4 rounded shadow-md bg-white"
    >
      {/* Lado izquierdo con info */}
      <div className="flex-1 mb-4 max-sm:text-xs sm:mb-0">
        <h2 className="text-xl font-bold mb-2 text-[#2D5DA1]">
          {viaje.punto_concentracion}
        </h2>

        <div className="flex flex-wrap gap-4 text-gray-700">
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
      <div className="flex items-center sm:flex-row gap-2 sm:items-center sm:justify-end sm:space-x-4 w-full sm:w-auto">
        {/* Botones */}
        <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4 mb-0">
            <div
              className={` px-4 p-2 rounded-md border-2 font-bold mx-auto ${
                color === "green"
                  ? "bg-green-300 border-green-600 text-green-600"
                  : "bg-red-300 border-red-600 text-red-600"
              }`}
            >
              <span className="max-sm:text-sm">{estado}</span>
            </div>
        </div>
        {/* Botón para abrir el modal */}
        <button
          className="max-sm:text-sm max-sm:w-8/12 mx-auto cursor-pointer bg-[#2D5DA1] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#1b3a6b] transition"
          onClick={() => setShowModal(true)}
          type="button"
        >
          Ver detalles del conductor
        </button>

        {/* Modal */}
        {showModal && (
          <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-11/12">
              {/* Botón de cerrar */}
              <button
            className=" cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            onClick={() => setShowModal(false)}
            type="button"
            aria-label="Cerrar"
              >
            ×
              </button>
              {/* Aquí va el componente de detalles */}
              <DetalleConductorModal {...conductor}/>
            </div>
          </div>
        )}
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
