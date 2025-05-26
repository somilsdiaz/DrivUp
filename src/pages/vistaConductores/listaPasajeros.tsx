import HeaderFooterConductores from "../../layouts/headerFooterConductores";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/auth";

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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  // Función para manejar el clic en "Contactar"
  const handleContactClick = async (driverId: number) => {
    try {
      const currentUserId = getUserId();

      if (!currentUserId) {
        // Redirigir al login si no hay usuario autenticado
        navigate('/login');
        return;
      }

      // Crear o recuperar la conversación existente
      const response = await fetch('http://localhost:5000/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: driverId,      // El ID del conductor
          passengerId: currentUserId // El ID del pasajero actual
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la conversación');
      }

      const conversationData = await response.json();

      // Almacenar ID de la conversación en localStorage para que se abra automáticamente
      localStorage.setItem('openConversationId', conversationData.id.toString());

      // Redirigir a la bandeja de mensajes
      navigate('/dashboard/conductor/solicitudes');
    } catch (error) {
      console.error('Error al contactar al conductor:', error);
      setError('No se pudo contactar al conductor. Intenta nuevamente.');
    }
  };


  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const res = await fetch("http://localhost:5000/rutas-usuarios");
        const data = await res.json();

        const pasajerosConNombre = await Promise.all(
          data.map(async (pasajero: Pasajero) => {
            const resUsuario = await fetch(`http://localhost:5000/usuario/${pasajero.user_id}`);
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-center text-gray-500">Cargando pasajeros...</p>
        ) : (
          <div className="grid gap-4">
            {pasajeros.map((pasajero) => (
              <div key={pasajero.id} className="border p-4 rounded shadow-md flex flex-col md:flex-row items-center">
                {/* <img
                  src={`http://localhost:5000/uploads/${pasajero.foto_de_perfil}`}
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
                  <button
                    onClick={() => handleContactClick(pasajero.user_id)}
                    className="cursor-pointer bg-[#F2B134] text-[#2D5DA1] font-bold px-4 py-2 rounded hover:bg-yellow-500">
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