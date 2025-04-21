import { useState } from "react";
import { useForm } from "react-hook-form"
import logo from "../assets/drivup_darklogo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    interface LoginFormInputs {
        email: string;
        password: string;
    }

    const { register,
        handleSubmit,
        formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true); // Inicia el estado de carga
        try {
            const response = await fetch("https://unibus-backend.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (!response.ok) {
                if (result.message) {
                    throw new Error(result.message);
                }
                throw new Error("Email o contraseña incorrectos");
            }
            setSuccessMessage("Inicio de sesión exitoso...");
            localStorage.setItem("token", result.token);

            // Redirige inmediatamente después de guardar el token, o con tiempo de espera si es necesario
            setTimeout(() => {
                setLoading(true)
                navigate("/dashboard/pasajero"); // Redirige al inicio
            }, 300); // Esto es opcional si prefieres un mensaje de éxito primero
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorMessage(error instanceof Error ? error.message : "Error desconocido al iniciar sesión");
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };


    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de éxito

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-2"
                style={{ borderColor: "#122562" }}
            >
                <div className="flex items-center justify-center ">
                    <img src={logo} alt="Logo" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Iniciar Sesión
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
                            {...register("password", {
                                required: "Este campo es obligatorio.",
                            })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition" >
                        Iniciar Sesión
                    </button>
                </form>
                {/* Mostrar el spinner si la carga está en proceso */}
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
                    ¿No tienes una cuenta?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Regístrate
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;