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
        marca_de_vehiculo: "Toyota" | "Honda" | "Ford" | "Chevrolet" | "Nissan" | "Hyundai"  | "Kia" | "Volkswagen" | "BMW" | "Mercedes-Benz" | "Mazda" | "Audi" | "Renault" | "Peugeot" | "Fiat" | "Jeep" | "Subaru" | "Volvo" | "Mitsubishi" | "Tesla"; //Lista dropdown.
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
    const onSubmit = async(data: FormValues) => {
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
        <div></div>        
    );
};

export default DriverRegister;

