import HeaderFooterConductores from "../../layouts/headerFooterConductores";
import { useEffect, useState } from "react";

type Pasajero = {
  id: number;
  user_id: number;
  origen: string;
  destino: string;
  dias: string;
  hora: string;
  descripcion: string;
};

type Usuario = {
  id: number;
  name: string;
  second_name: string;
  last_name: string;
  second_last_name: string;

};

const ListaPasajeros = () => {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const res = await fetch("https://drivup-backend.onrender.com/rutas-usuarios");
        const data = await res.json();

        const pasajerosConNombre = await Promise.all(
          data.map(async (pasajero: Pasajero) => {
            const resUsuario = await fetch(`https://drivup-backend.onrender.com/usuario/${pasajero.user_id}`);
            const usuario: Usuario = await resUsuario.json();
            const nombre_completo = [
              usuario.name,
              usuario.second_name,
              usuario.last_name,
              usuario.second_last_name,
            ]
              .filter(Boolean) // elimina null, undefined, '', 0, false
              .join(' ');
            

            return { ...pasajero, nombre_completo };
          })
        );

        setPasajeros(pasajerosConNombre);
      } catch (error) {
        console.error("Error al cargar pasajeros", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasajeros();
  }, []);

  return (
    <HeaderFooterConductores>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pasajeros Buscando Viaje</h1>
        {loading ? (
          <p className="text-center text-gray-500">Cargando pasajeros...</p>
        ) : (
          <div className="grid gap-4">
            {pasajeros.map((pasajero) => (
              <div key={pasajero.id} className="border p-4 rounded shadow-md flex flex-col md:flex-row items-center">
                {/* <img
                  src={`https://drivup-backend.onrender.com/uploads/${pasajero.foto_de_perfil}`}
                  alt="Perfil"
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                /> */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{(pasajero as any).nombre_completo || "Nombre no disponible"}</h2>
                  <p className="text-gray-600">Origen: {pasajero.origen}</p>
                  <p className="text-gray-600">Destino: {pasajero.destino}</p>
                  <p className="text-gray-600">Días: {pasajero.dias}</p>
                  <p className="text-gray-600">Horas: {pasajero.hora}</p>
                  <p className="text-gray-600">Descripción: {pasajero.descripcion}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="cursor-pointer bg-[#F2B134] text-[#2D5DA1] font-bold px-4 py-2 rounded hover:bg-yellow-500">
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HeaderFooterConductores>
  );
};

export default ListaPasajeros;