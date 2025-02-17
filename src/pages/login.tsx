import { useState } from "react";
import { useForm } from "react-hook-form"
import logo from "../assets/unibus-high-resolution-logo-transparent.png"
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    interface LoginFormInputs {
        email: string;
        password: string;
    }

    const { register,
        handleSubmit,
        formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Datos del formulario:", data);
        // Aquí va la lógica para enviar los datos al servidor

        // Si la operación fue exitosa:
        setSuccessMessage("Logging in...");
    
       // Después de 5 segundos redirigir a pagina de inicio
       setTimeout(() => {
         navigate("/");
        }, 5000);
    };

    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-2"
                style={{ borderColor: "#122562" }}
            >
                <div className="flex items-center justify-center ">
                    <img src={logo} alt="Logo" className="h-48 w-48 mr-12" />
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
                {/* Mostrar mensaje de éxito si está presente */}
                {successMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700">
                        {successMessage}
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