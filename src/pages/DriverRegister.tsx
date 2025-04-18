import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/drivup_darklogo.png";
import { useNavigate } from "react-router-dom";

const DriverRegister = () => {
    type FormValues = {
        //Detalles del Vehiculo.
        licencia_de_conducir: string;
        fecha_de_vencimiento: Date;
        foto_de_perfil: File; //maximo 2GB de tamaño.
        marca_de_vehiculo: "Toyota" | "Honda" | "Ford" | "Chevrolet" | "Nissan" | "Hyundai" | "Kia" | "Volkswagen" | "BMW" | "Mercedes-Benz" | "Mazda" | "Audi" | "Renault" | "Peugeot" | "Fiat" | "Jeep" | "Subaru" | "Volvo" | "Mitsubishi" | "Tesla"; //Lista dropdown.
        modelo_de_vehiculo: string; //Lista dinamica tipo dropdown.
        año_del_vehiculo: number;
        color_del_vehiculo: string;
        placa_del_vehiculo: string;
        Capacidad_de_pasajeros: number; //minimo 1.

        //Carga de documentos
        tarjeta_de_propiedad_vehicular: File; //Maximo 5Gb de tamaño
        seguro_del_vehiculo: File; // SOAT y poliza de responsabilidad civil, 5GB (multiple archivos)
        foto_de_licencia: File; //escaneo de la foto de licencia de conducir ambos lados.
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormValues>();

    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook para redirección
    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            console.log("Formulario enviado:", data);

            // const response = await fetch("https://unibus-backend.onrender.com/registro", { //quizas otro path
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(data)
            // });

            // const result = await response.json(); // Convertimos la respuesta en JSON

            // if (!response.ok) {
            //     if (result.message) {
            //         throw new Error(result.message); // Capturar el mensaje de error del backend
            //     }
            //     throw new Error("Error en el registro");
            // }

            setSuccessMessage("¡Ha sido registrado con éxito!");

            setTimeout(() => {
                navigate("/");
            }, 300);
            // } catch (error) {
            //     console.error("Error al enviar el formulario:", error);

            //     // Muestra el mensaje de error en la interfaz
            //     if (error instanceof Error) {
            //         setErrorMessage(error.message); // Mostrar mensaje de error del backend
            //     }
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-2"
                style={{ borderColor: "#122562" }}
            >
                <div className="flex items-center justify-center ">
                    <img src={logo} alt="Logo" />
                </div>
                <h2 className="text-2xl font-bold text-center text-[#4A4E69] mb-6">
                    Registro de Conductor
                </h2>
                {/* Mostrar el spinner si la carga está en proceso */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label
                            htmlFor="licencia_de_conducir"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Licencia de conducir
                        </label>
                        <input
                            type="text"
                            id="licencia_de_conducir"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="************"
                            {...register("licencia_de_conducir", { required: "Este campo es obligatorio." })}
                        ></input>
                        {errors.licencia_de_conducir && (
                            <p className="text-red-500 text-sm mt-2">{errors.licencia_de_conducir.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="fecha_de_vencimiento"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            fecha de fecha de vencimiento
                        </label>
                        <input
                            type="text"
                            id="fecha_de_vencimiento"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="dd/mm/yyyy"
                            {...register("fecha_de_vencimiento", { required: "Este campo es obligatorio." })}
                        ></input>
                        {errors.fecha_de_vencimiento && (
                            <p className="text-red-500 text-sm mt-2">{errors.fecha_de_vencimiento.message}</p>
                        )}
                    </div>
                    <div>
                    <label htmlFor="foto_de_perfil" className="block text-gray-700 font-medium mb-2">
                            Foto de perfil
                        </label>

                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="foto_de_perfil"
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            <span className="text-sm text-gray-500 truncate w-64">
                            {(watch("foto_de_perfil") as unknown as FileList)?.[0]?.name || "Ningún archivo seleccionado"}
                            </span>
                        </div>
                        <input
                            type="file"
                            id="foto_de_perfil"
                            className="hidden"
                            accept="image/*"
                            {...register("foto_de_perfil", { required: "Este campo es obligatorio." })}
                        />
                        {errors.foto_de_perfil && (
                            <p className="text-red-500 text-sm mt-2">{errors.foto_de_perfil.message}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="marca_de_vehiculo"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Marca de vehiculo
                        </label>
                        <select
                            id="marca_de_vehiculo"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("marca_de_vehiculo", { required: "Este campo es obligatorio." })}
                        >
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="Kia">Kia</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="BMW">BMW</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                            <option value="Mazda">Mazda</option>
                            <option value="Audi">Audi</option>
                            <option value="Renault">Renault</option>
                            <option value="Peugeot">Peugeot</option>
                            <option value="Fiat">Fiat</option>
                            <option value="Jeep">Jeep</option>
                            <option value="Subaru">Subaru</option>
                            <option value="Volvo">Volvo</option>
                            <option value="Mitsubishi">Mitsubishi</option>
                            <option value="Tesla">Tesla</option>
                        </select>
                        {errors.marca_de_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.marca_de_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="modelo_de_vehiculo"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Modelo de vehiculo
                        </label>
                        <select
                            id="modelo_de_vehiculo"
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            {...register("modelo_de_vehiculo", { required: "Este campo es obligatorio." })}
                        >

                        </select>
                        {errors.modelo_de_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.modelo_de_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="año_del_vehiculo"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Año del vehiculo
                        </label>
                        <input
                            type="text"
                            id="año_del_vehiculo"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 2021"
                            {...register("año_del_vehiculo", { required: "Este campo es obligatorio." })}
                            onInput={(e) => {
                                // Aseguramos que e.target es un HTMLInputElement
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, "").slice(0, 4);
                            }}
                        ></input>
                        {errors.año_del_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.año_del_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="color_del_vehiculo"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Color del vehículo
                        </label>
                        <input
                            type="text"
                            id="color_del_vehiculo"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej. Rojo"
                            {...register("color_del_vehiculo", { required: "Este campo es obligatorio." })}
                        />
                        {errors.color_del_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.color_del_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="placa_del_vehiculo"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Placa del vehículo
                        </label>
                        <input
                            type="text"
                            id="placa_del_vehiculo"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                            placeholder="Ej. ABC123"
                            {...register("placa_del_vehiculo", {
                                required: "Este campo es obligatorio.",
                                maxLength: { value: 10, message: "Máximo 10 caracteres." },
                            })}
                        />
                        {errors.placa_del_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.placa_del_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="Capacidad_de_pasajeros"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Capacidad de pasajeros
                        </label>
                        <input
                            type="number"
                            id="Capacidad_de_pasajeros"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mínimo 1"
                            {...register("Capacidad_de_pasajeros", {
                                required: "Este campo es obligatorio.",
                                min: { value: 1, message: "Debe ser al menos 1." },
                            })}
                        />
                        {errors.Capacidad_de_pasajeros && (
                            <p className="text-red-500 text-sm mt-2">{errors.Capacidad_de_pasajeros.message}</p>
                        )}
                    </div>
                    <div>
                    <label htmlFor="tarjeta_de_propiedad_vehicular" className="block text-gray-700 font-medium mb-2">
                            Tarjeta de propiedad del vehiculo
                        </label>

                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="tarjeta_de_propiedad_vehicular"
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            <span className="text-sm text-gray-500 truncate w-64">
                            {(watch("tarjeta_de_propiedad_vehicular") as unknown as FileList)?.[0]?.name || "Ningún archivo seleccionado"}
                            </span>
                        </div>
                        <input
                            type="file"
                            id="tarjeta_de_propiedad_vehicular"
                            accept="application/pdf,image/*"
                            className="hidden"
                            {...register("tarjeta_de_propiedad_vehicular", {
                                required: "Este campo es obligatorio.",
                                validate: (fileList) =>
                                    (fileList as unknown as FileList)?.[0]?.size <= 5 * 1024 * 1024 * 1024 ||
                                    "El archivo no debe superar 5 GB.",
                            })}
                        />
                        {errors.tarjeta_de_propiedad_vehicular && (
                            <p className="text-red-500 text-sm mt-2">{errors.tarjeta_de_propiedad_vehicular.message}</p>
                        )}
                    </div>
                    <div>
                    <label htmlFor="seguro_del_vehiculo" className="block text-gray-700 font-medium mb-2">
                            Seguro del vehiculo
                        </label>

                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="seguro_del_vehiculo"
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            <span className="text-sm text-gray-500 truncate w-64">
                            {(watch("seguro_del_vehiculo") as unknown as FileList)?.[0]?.name || "Ningún archivo seleccionado"}
                            </span>
                        </div>
                        <input
                            type="file"
                            id="seguro_del_vehiculo"
                            multiple
                            accept="application/pdf,image/*"
                            className="hidden"
                            {...register("seguro_del_vehiculo", {
                                required: "Este campo es obligatorio.",
                                validate: (fileList) =>
                                    Array.from(fileList as unknown as FileList).every(
                                        file => file.size <= 5 * 1024 * 1024 * 1024
                                    ) || "Cada archivo debe ser menor a 5 GB.",
                            })}
                        />
                        {errors.seguro_del_vehiculo && (
                            <p className="text-red-500 text-sm mt-2">{errors.seguro_del_vehiculo.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="foto_de_licencia" className="block text-gray-700 font-medium mb-2">
                            Foto de licencia (ambos lados)
                        </label>

                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="foto_de_licencia"
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            <span className="text-sm text-gray-500 truncate w-64">
                            {(watch("foto_de_licencia") as unknown as FileList)?.[0]?.name || "Ningún archivo seleccionado"}
                            </span>
                        </div>

                        <input
                            type="file"
                            id="foto_de_licencia"
                            accept="image/*"
                            className="hidden"
                            {...register("foto_de_licencia", {
                                required: "Este campo es obligatorio.",
                                validate: (fileList) =>
                                    (fileList as unknown as FileList)?.[0]?.size <= 5 * 1024 * 1024 * 1024 ||
                                    "El archivo no debe superar 5 GB.",
                            })}
                        />
                        {errors.foto_de_licencia && (
                            <p className="text-red-500 text-sm mt-2">{errors.foto_de_licencia.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition" >
                        Registrar
                    </button>
                </form>
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
                <p className="text-center text-gray-600 mt-4">
                    ¿Deseas volver a la pagina de inicio?{" "}
                    <a href="/" className="text-blue-500 hover:underline">
                        Haz click aqui
                    </a>
                </p>
            </div>
        </div>
    );
};

export default DriverRegister;

