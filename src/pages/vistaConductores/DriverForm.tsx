import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const DriverForm = () => {

    type FormValues = {
        origen_aproximado: string;
        destino_aproximado: string;
        descripcion: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const token = localStorage.getItem("token"); // o donde lo estés guardando

    if (!token) {
        throw new Error("Usuario no autenticado. Por favor inicia sesión.");
    }

    const [initialData, setInitialData] = useState<FormValues>({
        origen_aproximado: "",
        destino_aproximado: "",
        descripcion: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/conductor-preferencias", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setInitialData({
                    origen_aproximado: data.origen_aproximado || "",
                    destino_aproximado: data.destino_aproximado || "",
                    descripcion: data.descripcion || ""
                });
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [token]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            console.log("Formulario enviado:", data);

            const response = await fetch("http://localhost:5000/configuracion-conductores-viaje", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json(); // Convertimos la respuesta en JSON

            if (!response.ok) {
                if (result.message) {
                    throw new Error(result.message); // Capturar el mensaje de error del backend
                }
                throw new Error("Error en el registro");
            }

            setSuccessMessage("¡Los cambios fueron guardados!");
        } catch (error) {
            console.error("Error al guardar los cambios:", error);

            // Muestra el mensaje de error en la interfaz
            if (error instanceof Error) {
                setErrorMessage(error.message); // Mostrar mensaje de error del backend
            }
        } finally {
            setLoading(false); // Finaliza el estado de carga
            setEditMode(false);
        }
    };

    return (
        <div>
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Preferencias de viaje</h1>
                {/* Aquí agregas los formularios o componentes que quieras */}
                <p className="text-gray-600 mb-4">Configura aquí tus preferencias de viaje para que los pasajeros conozcan tus rutas
                    recurrentes</p>
                <div className="w-full bg-white p-8 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label
                                htmlFor="origen_aproximado"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Origen aproximado de tu ruta:
                            </label>
                            <input
                                type="text"
                                id="origen_aproximado"
                                disabled={!editMode}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-0"
                                placeholder={initialData.origen_aproximado || "Ej: calle 50 #46-70"}
                                {...register("origen_aproximado")}
                            ></input>
                            {errors.origen_aproximado && (
                                <p className="text-red-500 text-sm mt-2">{errors.origen_aproximado.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="destino_aproximado"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Destino aproximado de tu ruta:
                            </label>
                            <input
                                type="text"
                                id="destino_aproximado"
                                disabled={!editMode}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-0"
                                placeholder={initialData.destino_aproximado || "Ej: calle 50 #46-70"}
                                {...register("destino_aproximado")}
                            ></input>
                            {errors.destino_aproximado && (
                                <p className="text-red-500 text-sm mt-2">{errors.destino_aproximado.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="descripcion"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Descripcion: (Detalla como haces tu recorrido, en que horas las sueles hacer, que
                                días y bajo que restricciones)
                            </label>
                            <textarea
                                id="descripcion"
                                disabled={!editMode}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px] 
                                disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-0"
                                placeholder={initialData.descripcion || " "}
                                {...register("descripcion")}
                            ></textarea>
                            {errors.descripcion && (
                                <p className="text-red-500 text-sm mt-2">{errors.descripcion.message}</p>
                            )}
                        </div>
                        {!editMode ? (
                            <button
                                type="button" // Este solo cambia el modo de edición
                                onClick={() => setEditMode(true)}
                                className="mt-4 w-40 bg-[#5AAA95] text-white py-3 rounded-lg hover:bg-[#5AAA95] transition hover:scale-110"
                            >
                                Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button" // Este simplemente desactiva el modo de edición sin hacer submit
                                    onClick={() => setEditMode(false)}
                                    className="mt-4 w-40 bg-[#880808] text-white py-3 rounded-lg hover:bg-[#880808] transition hover:scale-110"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit" // Este hace el submit del formulario
                                    className="ml-4 mt-4 w-40 bg-[#5AAA95] text-white py-3 rounded-lg hover:bg-[#5AAA95] transition hover:scale-110"
                                >
                                    Guardar
                                </button>
                            </>
                        )}
                    </form>
                </div>

                {loading && (
                    <div className="flex justify-center mb-4 mt-4">
                        <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
                        <span className="ml-2 text-gray-700">Cargando...</span>
                    </div>)}
                {/* Mostrar mensaje de éxito si está presente */}
                {successMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700">
                        {successMessage}
                    </div>)}
                {/* Mostrar mensaje de error si está presente */}
                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700">
                        {errorMessage}
                    </div>)}

            </main >
        </div >
    );
};

export default DriverForm;