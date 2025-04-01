import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import {useForm} from 'react-hook-form';
import {useState} from 'react';

const Contacto: React.FC = () => {
    interface FormType { nombre: string, correo: string, asunto: string, mensaje: string, archivo: FileList };
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormType>();
    const [confirm, setConfirm] = useState("");

    const onSubmit = async (data: FormType) => {
        try {
    
            const response = await fetch("https://unibus-backend.onrender.com/contactos", {
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
                throw new Error("Error en el envio del mensaje");
            }
    
            setConfirm("Tu mensaje ha sido enviado exitosamente");
            reset();
    
        } catch (error) {
            console.error("Error en el envio del mensaje:", error);
            
            // Muestra el mensaje de error en la interfaz
            if (error instanceof Error) {
                setConfirm(error.message); // Mostrar mensaje de error del backend
            }
        }


    }

    return (
        <HeaderFooter>
            <h1 className='text-center text-5xl text-green-700 my-6'>Contacto</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center md:items-start p-6 pl-8">
                <section className='flex flex-col md:flex-row gap-6'>
                    <div>
                        <label htmlFor="nombre" className='text-green-700 text-xl flex flex-col gap-2'>Nombre completo:
                            <input type="text"
                                className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                                focus:outline-none focus:border-green-700 text-base w-72 ${errors.nombre ? 'border-red-500' : 'border-[#EDEDED]'}`}
                                {...register("nombre", {
                                    required: "El nombre completo es requerido",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
                                        message: "El nombre no es valido"
                                    }
                                })} />
                        </label>
                        {errors.nombre && <p className='text-red-500'>{errors.nombre.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="correo" className='text-green-700 text-xl flex flex-col gap-2'>Correo electronico:
                            <input type="text"
                                className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                                focus:outline-none focus:border-green-700 text-base w-72 md:w-64 ${errors.correo ? 'border-red-500' : 'border-[#EDEDED]'}`}
                                {...register("correo", {
                                    required: "El correo es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "El correo no es valido"
                                    }
                                })} />
                        </label>
                        {errors.correo && <p className='text-red-500'>{errors.correo.message}</p>}
                    </div>
                </section>
                <div>
                    <label htmlFor="asunto" className='text-green-700 text-xl flex flex-col gap-2'>Asunto:
                        <select
                            className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                            focus:outline-none focus:border-green-700 text-base w-72 ${errors.asunto ? 'border-red-500' : 'border-[#EDEDED]'}`}
                            {...register("asunto", { required: "El asunto es requerido" })}>
                            <option value="Consulta">Consulta</option>
                            <option value="Reportar problema">Reportar problema</option>
                            <option value="Sugerencia">Sugerencia</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </label>
                    {errors.asunto && <p className='text-red-500'>{errors.asunto.message}</p>}
                </div>
                <div>
                    <label htmlFor="mensaje" className='text-green-700 text-xl flex flex-col gap-2'>Mensaje:
                        <textarea
                            className={` p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                            focus:outline-none focus:border-green-700 w-96 h-36 text-base ${errors.mensaje ? 'border-red-500' : 'border-[#EDEDED]'}`}
                            {...register("mensaje", { required: "El mensaje es requerido" })}></textarea>
                    </label>
                    {errors.mensaje && <p className='text-red-500'>{errors.mensaje.message}</p>}
                </div>
                <div>
                    <label htmlFor="archivo" className='text-green-700 md:text-xl flex flex-col gap-2'>Archivo adjunto (opcional, solo archivos PDF o imágenes, máximo 2MB):
                        <input type="file"
                            className='file:p-2 file:px-4 file:cursor-pointer hover:file:bg-green-400 file:bg-green-700 file:text-white 
                            text-[#333] file:rounded-md file:border-2 file:transition file:duration-150
                            focus:outline-none file:focus:border-green-700 '
                            {...register("archivo", {
                                validate: {
                                    fileType: (value: FileList) => {
                                        if (value[0]) {
                                            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                                            return allowedTypes.includes(value[0].type) || "Solo se permiten archivos PDF o imágenes";
                                        }
                                        return true;
                                    },
                                    fileSize: (value: FileList) => {
                                        if (value[0]) {
                                            return value[0].size <= 2 * 1024 * 1024 || "El archivo debe ser menor a 2MB";
                                        }
                                        return true;
                                    }
                                }
                            })} />
                    </label>
                    {errors.archivo && <p className='text-red-500'>{errors.archivo.message}</p>}
                </div>
                <button type='submit' className='mt-6 bg-green-700 text-white rounded-md px-8 p-2 cursor-pointer hover:bg-green-400 transition duration-150'>Enviar</button>
                <p className={confirm==="Tu mensaje ha sido enviado exitosamente"?
                    "text-green-600":"text-red-600"
                }>{confirm}</p>
            </form>
        </HeaderFooter>
    );
};

export default Contacto;