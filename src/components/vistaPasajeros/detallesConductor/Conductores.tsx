import { useEffect, useState } from "react";
import { apiConductorProps } from "../../../core/interfaces/conductorProps";
import { Estrellas } from "../reseñas/estrellas";
import { DetallesConductor } from "./detallesConductor";
import { Link, useNavigate } from "react-router-dom";
import { usehandleContactClick } from "../../../hooks/handleContactClick";



const Conductores = ({ conductoresFiltrados }: { conductoresFiltrados: apiConductorProps[] }) => {

const [conductorSeleccionado, setConductorSeleccionado] = useState<apiConductorProps | undefined>(conductoresFiltrados?.[0]);
const [windowWidth, setWindow] = useState(window.innerWidth);
const [id,setId]=useState<Number>();
const [error,setError]=useState<string>("");
const navigate=useNavigate();
const handleBackToList=usehandleContactClick();
useEffect(() => {
  const handleResize = () => setWindow(window.innerWidth);
  window.addEventListener("resize", handleResize);
  handleResize(); // Set initial width
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className="flex gap-4">
    <section className="max-[1080px]:w-full grid gap-4 overflow-y-auto max-h-[80vh] w-4/9 border rounded-md">
    {conductoresFiltrados.map((conductor) => (
      <div  key={conductor.id}
      className="flex flex-col">
        <div
       
        className="border p-4 rounded shadow-md flex flex-col md:flex-row items-center"
      >
        <img
          src={`https://drivup-backend.onrender.com/uploads/${conductor.foto_de_perfil}`}
          alt={conductor.nombre_completo}
          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
        />

        <div className="flex-1">
          <h2 className="text-xl font-bold">{conductor.nombre_completo}</h2>

          <div className="flex items-center mt-1">
            <Estrellas calificacion={Math.round(conductor.promedio_calificacion)}/>
          </div>
          <p className="text-gray-600"> Nombre: {conductor.nombre_completo}</p>
          <p className="text-gray-600">Capacidad: {conductor.capacidad_de_pasajeros} pasajeros</p>
          <p className="text-gray-600">
            Miembro desde:{" "}
            {new Date(conductor.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-gray-600">Origen: {conductor.origen_aproximado ? conductor.origen_aproximado : "Información no disponible"}</p>
          <p className="text-gray-600">Destino: {conductor.destino_aproximado ? conductor.destino_aproximado : "Información no disponible"}</p>
        </div>

        <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
          {1080<windowWidth?(
            <button
            onClick={() => setConductorSeleccionado(conductor)}
             className="cursor-pointer bg-[#2D5DA1] blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
           >
             Ver Detalles
           </button>
          ):(
            <button
           onClick={() => setConductorSeleccionado(conductor)}
            className="cursor-pointer bg-[#2D5DA1] blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
          >
           <Link to="/dashboard/conductor/solicitudes/detallesConductor" state={conductor}>Ver Detalles</Link>
          </button>
          )}
          <button onClick={()=>{handleBackToList({driverId:Number(conductor.user_id),setError:setError,setIdNumber:setId,navigate:navigate})}} 
          className="cursor-pointer bg-[#F2B134] text-[#2D5DA1] font-bold px-4 py-2 rounded hover:bg-yellow-500">
            Contactar
          </button>
        </div>
      </div>
      {error!==""&&id===conductor.user_id&&(<span className="self-end mt-4 mx-auto text-xs p-1 text-red-600 border border-red-600 bg-red-300 ">{error}</span> )}
      </div>
    ))}
  </section>
  {windowWidth > 1080 && (
    <>
      {conductorSeleccionado ? (
        <DetallesConductor {...conductorSeleccionado} />
      ) : (
        <span className="flex justify-center p-2 text-2xl font-bold">
          No se encontró información del conductor
        </span>
      )}
    </>
  )}
  </div>
  );
};

export default Conductores;