import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/drivup_darklogo.png";
import { useNavigate } from "react-router-dom";

const DriverRegister = () => {
    type FormValues = {
        //Detalles del Vehiculo.
        licencia_de_conducir: string;
        fecha_de_vencimiento: String;
        foto_de_perfil: File; //maximo 2GB de tamaño.
        marca_de_vehiculo: "Toyota" | "Honda" | "Ford" | "Chevrolet" | "Nissan" | "Hyundai" | "Kia" | "Volkswagen" | "BMW" | "Lexus" | "Mercedes-Benz" | "Mazda" | "Audi" | "Renault" | "Peugeot" | "Fiat" | "Jeep" | "Subaru" | "Volvo" | "Mitsubishi" | "Tesla"; //Lista dropdown.
        modelo_de_vehiculo: string; //Lista dinamica tipo dropdown.
        año_del_vehiculo: number;
        color_del_vehiculo: string;
        placa_del_vehiculo: string;
        Capacidad_de_pasajeros: number; //minimo 1.

        //Carga de documentos
        tarjeta_de_propiedad_vehicular: File[]; //Maximo 5Gb de tamaño
        seguro_del_vehiculo: File[]; // SOAT y poliza de responsabilidad civil, 5GB (multiple archivos)
        foto_de_licencia: File[]; //escaneo de la foto de licencia de conducir ambos lados.
    };
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        watch
    } = useForm<FormValues>();

    const modelosPorMarca: Record<string, string[]> = {
        Toyota: [
            "Corolla",
            "Hilux",
            "Yaris",
            "Camry",
            "Hiace",
            "ProAce",
            "Granvia",
            "Sienna"
        ],
        Honda: [
            "Civic",
            "Accord",
            "CR-V",
            "Fit",
            "Odyssey",
            "Stepwgn",
            "Freed"
        ],
        Ford: [
            "Focus",
            "Fiesta",
            "Mustang",
            "Explorer",
            "Transit custom",
            "Tourneo",
            "Econoline (E-Series)"
        ],
        Chevrolet: [
            "Spark",
            "Cruze",
            "Tracker",
            "Camaro",
            "Express Van",
            "N300",
            "Astro",
            "Venture"
        ],
        Nissan: [
            "Sentra",
            "Versa",
            "Altima",
            "Frontier",
            "NV Passenger series",
            "Urvan / Caravan",
            "NV200 / Evalia",
            "Interstar",
            "Townstar"

        ],
        Hyundai: [
            "Elantra",
            "Tucson",
            "Santa Fe",
            "Accent",
            "H-1 / Starex",
            "Staria",
            "H350 / Solati"
        ],
        Kia: [
            "Rio",
            "Sportage",
            "Sorento",
            "Cerato",
            "Carnival",
            "PV5 Light Camper"
        ],
        Volkswagen: [
            "Golf",
            "Jetta",
            "Tiguan",
            "Polo",
            "Transporter",
            "Multivan",
            "Caddy",
            "ID. Buzz"
        ],
        BMW: [
            "Serie 1",
            "Serie 3",
            "X5",
            "Z4",
            "i3"
        ],
        "Mercedes-Benz": [
            "Clase A",
            "Clase C",
            "Clase E",
            "GLA",
            "Sprinter",
            "Vito",
            "V-Class"
        ],
        Mazda: [
            "Mazda 3",
            "Mazda CX-5",
            "Mazda 6",
            "MX-5",
            "Mazda MPV",
            "Mazda Bongo"
        ],
        Audi: [
            "A3",
            "A4",
            "Q5",
            "Q7",
            "TT"
        ],
        Renault: [
            "Duster",
            "Logan",
            "Sandero",
            "Kwid",
            "Kangoo",
            "Trafic",
            "Master"
        ],
        Peugeot: [
            "208",
            "308",
            "2008",
            "3008",
            "Partner",
            "Traveller",
            "Expert",
            "Boxer"
        ],
        Lexus: [
            "UX",
            "NX",
            "RX",
            "IS",
            "LM"
        ],
        Fiat: [
            "Uno",
            "Mobi",
            "Cronos",
            "Toro",
            "Doblò",
            "Scudo",
            "Ducato"
        ],
        Jeep: [
            "Renegade",
            "Compass",
            "Wrangler",
            "Cherokee",
        ],
        Subaru: [
            "Impreza",
            "Forester",
            "Outback",
            "XV",
            "Sambar"
        ],
        Volvo: [
            "XC40",
            "XC60",
            "XC90",
            "S60",
            "EM90"
        ],
        Mitsubishi: [
            "Lancer",
            "Outlander",
            "Montero",
            "ASX",
            "Delica",
            "L300"
        ],
        Tesla: [
            "Model S",
            "Model 3",
            "Model X",
            "Model Y",
            "Cybertruck"
        ]
    };
    const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remueve todo lo que no sea número

        if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos

        // Inserta los slashes
        if (value.length >= 5) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        } else if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        setValue("fecha_de_vencimiento", value); // Asigna valor al campo del formulario
    };

    //refs

    const [selectedFiles, setSelectedFiles] = useState<{
        [key: string]: File[];
    }>({

        tarjeta_de_propiedad_vehicular: [],
        seguro_del_vehiculo: [],
        foto_de_licencia: [],
    });

    const fileInputRefs = {
        foto_de_perfil: useRef<HTMLInputElement>(null),
        tarjeta_de_propiedad_vehicular: useRef<HTMLInputElement>(null),
        seguro_del_vehiculo: useRef<HTMLInputElement>(null),
        foto_de_licencia: useRef<HTMLInputElement>(null),
    };


    const handleRemoveFile = (
        fieldName: string,
        indexToRemove: number,
        inputRef: React.RefObject<HTMLInputElement>
    ) => {
        // Obtener los archivos actuales del campo
        const currentFiles = watch(fieldName as any) as unknown as FileList | undefined;

        if (!currentFiles) return;

        // Crear un nuevo DataTransfer para manejar los archivos
        const dataTransfer = new DataTransfer();

        // Filtrar los archivos, eliminando el que coincide con el índice
        Array.from(currentFiles)
            .filter((_, i) => i !== indexToRemove)
            .forEach((file) => dataTransfer.items.add(file));

        // Actualizar el estado del formulario con los archivos filtrados
        setValue(fieldName as any, dataTransfer.files);

        // Actualizar el input file si existe
        if (inputRef.current) {
            inputRef.current.files = dataTransfer.files;
        }
    };


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
                            placeholder="dd/mm/yyyy Ej: 02/12/2045"
                            {...register("fecha_de_vencimiento", {
                                required: "Este campo es obligatorio.",
                                pattern: {
                                    value: /^\d{2}\/\d{2}\/\d{4}$/,
                                    message: "El formato debe ser dd/mm/yyyy",
                                },
                                validate: (value) => {
                                    const [day, month, year] = value.split("/").map(Number);
                                    const date = new Date(year, month - 1, day);

                                    const isValidDate =
                                        date.getFullYear() === year &&
                                        date.getMonth() === month - 1 &&
                                        date.getDate() === day;

                                    if (!isValidDate) return "La fecha ingresada no es válida.";

                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // Eliminar horas para comparar solo fecha

                                    if (date < today) {
                                        return "La fecha no puede ser anterior a hoy.";
                                    }

                                    return true;
                                },
                            })}
                            onChange={handleDateChange}
                            maxLength={10} // opcional para evitar más caracteres
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
                                className="cursor-pointer bg-[#5AAA95] hover:bg-[#295449] text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            {Array.from(watch("foto_de_perfil") as unknown as FileList || []).map((file, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 truncate w-64">📎 {file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile("foto_de_perfil", index, fileInputRefs["foto_de_perfil"])}
                                        className="text-red-500 hover:text-red-700 text-sm transform transition-transform duration-200 hover:scale-125"
                                        title="Eliminar archivo"
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
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
                            {...register("marca_de_vehiculo", {
                                required: "Este campo es obligatorio.",
                                onChange: (e) => setMarcaSeleccionada(e.target.value)
                            })}

                        >
                            <option value="">Selecciona una marca</option>
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
                            <option value="Lexus">Lexus</option>
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
                            <option value="">Selecciona un modelo</option>
                            {marcaSeleccionada &&
                                modelosPorMarca[marcaSeleccionada]?.map((modelo) => (
                                    <option key={modelo} value={modelo}>
                                        {modelo}
                                    </option>
                                ))}
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
                                className="cursor-pointer bg-[#5AAA95] hover:bg-[#295449] text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>
                            <div className="flex flex-col mt-2">
                                {Array.from(
                                    (watch("tarjeta_de_propiedad_vehicular") as unknown as FileList) || []
                                ).map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-600 truncate w-64">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveFile("tarjeta_de_propiedad_vehicular", index, fileInputRefs["tarjeta_de_propiedad_vehicular"])
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm transform transition-transform duration-200 hover:scale-125"
                                            title="Eliminar archivo"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <input
                            type="file"
                            id="tarjeta_de_propiedad_vehicular"
                            multiple
                            className="hidden"
                            {...register("tarjeta_de_propiedad_vehicular", { required: "Este campo es obligatorio." })}
                            ref={fileInputRefs["tarjeta_de_propiedad_vehicular"]}
                            onChange={(e) => {
                                const field = "tarjeta_de_propiedad_vehicular"; // Cambia esto según el campo
                                const newFiles = Array.from(e.target.files || []);
                                const totalFiles = [...(selectedFiles[field] || []), ...newFiles];

                                const isValid = totalFiles.every(file => file.size <= 5 * 1024 * 1024 * 1024);
                                if (!isValid) {
                                    setError(field, {
                                        type: "manual",
                                        message: "Cada archivo debe ser menor a 5 GB."
                                    });
                                    return;
                                }

                                clearErrors(field);
                                setSelectedFiles(prev => ({ ...prev, [field]: totalFiles }));
                                setValue(field, totalFiles);

                                // Reset input
                                if (fileInputRefs[field].current) {
                                    fileInputRefs[field].current!.value = "";
                                }
                            }}
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
                                className="cursor-pointer bg-[#5AAA95] hover:bg-[#295449] text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>
                            <div className="flex flex-col mt-2">
                                {Array.from(
                                    (watch("seguro_del_vehiculo") as unknown as FileList) || []
                                ).map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-600 truncate w-64">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveFile("seguro_del_vehiculo", index, fileInputRefs["seguro_del_vehiculo"])
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm transform transition-transform duration-200 hover:scale-125"
                                            title="Eliminar archivo"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <input
                            type="file"
                            id="seguro_del_vehiculo"
                            accept="application/pdf,image/*"
                            multiple
                            className="hidden"
                            {...register("seguro_del_vehiculo", { required: "Este campo es obligatorio." })}
                            ref={fileInputRefs["seguro_del_vehiculo"]}
                            onChange={(e) => {
                                const field = "seguro_del_vehiculo"; // Cambia esto según el campo
                                const newFiles = Array.from(e.target.files || []);
                                const totalFiles = [...(selectedFiles[field] || []), ...newFiles];

                                const isValid = totalFiles.every(file => file.size <= 5 * 1024 * 1024 * 1024);
                                if (!isValid) {
                                    setError(field, {
                                        type: "manual",
                                        message: "Cada archivo debe ser menor a 5 GB."
                                    });
                                    return;
                                }

                                clearErrors(field);
                                setSelectedFiles(prev => ({ ...prev, [field]: totalFiles }));
                                setValue(field, totalFiles);

                                // Reset input
                                if (fileInputRefs[field].current) {
                                    fileInputRefs[field].current!.value = "";
                                }
                            }}
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
                                className="cursor-pointer bg-[#5AAA95] hover:bg-[#295449] text-white px-4 py-2 rounded-lg shadow transition mb-4 mt-4"
                            >
                                Seleccionar archivo
                            </label>

                            <div className="flex flex-col mt-2">
                                {Array.from(
                                    (watch("foto_de_licencia") as unknown as FileList) || []
                                ).map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-600 truncate w-64">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveFile("foto_de_licencia", index, fileInputRefs["foto_de_licencia"])
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm transform transition-transform duration-200 hover:scale-125"
                                            title="Eliminar archivo"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <input
                            type="file"
                            id="foto_de_licencia"
                            accept="application/pdf,image/*"
                            multiple
                            className="hidden"
                            {...register("foto_de_licencia", { required: "Este campo es obligatorio." })}
                            ref={fileInputRefs["foto_de_licencia"]}
                            onChange={(e) => {
                                const field = "foto_de_licencia"; // Cambia esto según el campo
                                const newFiles = Array.from(e.target.files || []);
                                const totalFiles = [...(selectedFiles[field] || []), ...newFiles];

                                const isValid = totalFiles.every(file => file.size <= 5 * 1024 * 1024 * 1024);
                                if (!isValid) {
                                    setError(field, {
                                        type: "manual",
                                        message: "Cada archivo debe ser menor a 5 GB."
                                    });
                                    return;
                                }

                                clearErrors(field);
                                setSelectedFiles(prev => ({ ...prev, [field]: totalFiles }));
                                setValue(field, totalFiles);

                                // Reset input
                                if (fileInputRefs[field].current) {
                                    fileInputRefs[field].current!.value = "";
                                }
                            }}
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

