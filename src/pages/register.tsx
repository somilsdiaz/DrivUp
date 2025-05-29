import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/drivup_darklogo.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    type FormValues = {
        name: string;
        second_name: string;
        last_name: string;
        second_last_name: string;
        document_type: "cc" | "ti" | "passport" | "ce";
        document_number: number;
        email: string;
        phone_number: number;
        password: string;
        confirm_password: string;
        accept_data: boolean;
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
            const response = await fetch("https://drivup-backend.onrender.com/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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

            setSuccessMessage("¡Ha sido registrado con éxito!");

            setTimeout(() => {
                navigate("/login");
            }, 300);
        } catch (error) {
            console.error("Error al enviar el formulario:", error);

            // Muestra el mensaje de error en la interfaz
            if (error instanceof Error) {
                setErrorMessage(error.message); // Mostrar mensaje de error del backend
            }
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
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Registrar Usuario
                </h2>
                {/* Mostrar el spinner si la carga está en proceso */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Primer Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Primer Nombre"
                            {...register("name", { required: "Este campo es obligatorio." })}
                        ></input>
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="second_name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Segundo Nombre (opcional)
                        </label>
                        <input
                            type="text"
                            id="second_name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Segundo Nombre"
                            {...register("second_name")}
                        ></input>
                    </div>
                    <div>
                        <label
                            htmlFor="last_name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Primer Apellido
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Primer Apellido"
                            {...register("last_name", { required: "Este campo es obligatorio." })}
                        ></input>
                        {errors.last_name && (
                            <p className="text-red-500 text-sm mt-2">{errors.last_name.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="second_last_name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Segundo Apellido
                        </label>
                        <input
                            type="text"
                            id="second_last_name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Segundo Apellido"
                            {...register("second_last_name", { required: "Este campo es obligatorio." })}
                        ></input>
                        {errors.second_last_name && (
                            <p className="text-red-500 text-sm mt-2">{errors.second_last_name.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="document_type"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Tipo de Documento
                        </label>
                        <select
                            id="document_type"
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            {...register("document_type", { required: "Este campo es obligatorio." })}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="cc">Cédula de Ciudadanía</option>
                            <option value="ti">Tarjeta de Identidad</option>
                            <option value="passport">Pasaporte</option>
                            <option value="ce">Tarjeta de extranjería</option>
                        </select>
                        {errors.document_type && (
                            <p className="text-red-500 text-sm mt-2">{errors.document_type.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="document_number"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            No. del Documento
                        </label>
                        <input
                            type="text"
                            id="document_number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=" "
                            {...register("document_number", { required: "Este campo es obligatorio." })}
                            onInput={(e) => {
                                // Aseguramos que e.target es un HTMLInputElement
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, "").slice(0, 10);
                            }}
                        ></input>
                        {errors.document_number && (
                            <p className="text-red-500 text-sm mt-2">{errors.document_number.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="tucorreo@dominio.com"
                            {...register("email", {
                                required: "Este campo es obligatorio.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Correo invalido."
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="phone_number"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Celular
                        </label>
                        <input
                            type="tel"
                            id="phone_number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="XXX-XXX-XXXX"
                            maxLength={10}
                            {...register("phone_number", { required: "Este campo es obligatorio." })}
                            onInput={(e) => {
                                // Aseguramos que e.target es un HTMLInputElement
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, "");
                            }}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-sm mt-2">{errors.phone_number.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            {...register("password", { required: "Este campo es obligatorio." })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirm_password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            {...register("confirm_password", {
                                required: "Este campo es obligatorio.",
                                validate: (value) => value === watch("password") || "Las contraseñas no coinciden"
                            })}
                        />
                        {errors.confirm_password && (
                            <p className="text-red-500 text-sm mt-2">{errors.confirm_password.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                id="accept_data"
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                {...register("accept_data", { required: "Este campo es obligatorio." })}
                            />
                            <span className="ml-2 text-gray-700">
                                Acepto el tratamiento de mis datos personales.
                            </span>
                            {errors.accept_data && (
                                <p className="text-red-500 text-sm mt-2">{errors.accept_data.message}</p>
                            )}
                        </label>
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
                    ¿Ya tienes una cuenta?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Iniciar Sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;