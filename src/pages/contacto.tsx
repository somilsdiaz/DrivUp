import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import {useForm} from 'react-hook-form';
import {useState} from 'react';

const Contacto: React.FC = () => {
    interface FormType { Name: string, Email: string, Subject: string, Message: string, Document: FileList };
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormType>();
    const [confirm, setConfirm] = useState("");

    const onSubmit = (data: FormType) => {
        console.log(data);
        setConfirm("Tu mensaje ha sido enviado exitosamente");
        reset();
    }

    return (
        <HeaderFooter>
            <h1 className='text-center text-5xl text-green-700 my-6'>Contacto</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center md:items-start p-6 pl-8">
                <section className='flex flex-col md:flex-row gap-6'>
                    <div>
                        <label htmlFor="Name" className='text-green-700 text-xl flex flex-col gap-2'>Nombre completo:
                            <input type="text"
                                className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                                focus:outline-none focus:border-green-700 text-base w-72 ${errors.Name ? 'border-red-500' : 'border-[#EDEDED]'}`}
                                {...register("Name", {
                                    required: "El nombre completo es requerido",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
                                        message: "El nombre no es valido"
                                    }
                                })} />
                        </label>
                        {errors.Name && <p className='text-red-500'>{errors.Name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="Email" className='text-green-700 text-xl flex flex-col gap-2'>Correo electronico:
                            <input type="text"
                                className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                                focus:outline-none focus:border-green-700 text-base w-72 md:w-64 ${errors.Email ? 'border-red-500' : 'border-[#EDEDED]'}`}
                                {...register("Email", {
                                    required: "El correo es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "El correo no es valido"
                                    }
                                })} />
                        </label>
                        {errors.Email && <p className='text-red-500'>{errors.Email.message}</p>}
                    </div>
                </section>
                <div>
                    <label htmlFor="Subject" className='text-green-700 text-xl flex flex-col gap-2'>Asunto:
                        <select
                            className={`p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                            focus:outline-none focus:border-green-700 text-base w-72 ${errors.Subject ? 'border-red-500' : 'border-[#EDEDED]'}`}
                            {...register("Subject", { required: "El asunto es requerido" })}>
                            <option value="Consult">Consulta</option>
                            <option value="Report">Reportar problema</option>
                            <option value="Suggest">Sugerencia</option>
                            <option value="Others">Otros</option>
                        </select>
                    </label>
                    {errors.Subject && <p className='text-red-500'>{errors.Subject.message}</p>}
                </div>
                <div>
                    <label htmlFor="Message" className='text-green-700 text-xl flex flex-col gap-2'>Mensaje:
                        <textarea
                            className={` p-2 bg-[#fff] text-[#333] rounded-lg border-2 
                            focus:outline-none focus:border-green-700 w-96 h-36 text-base ${errors.Message ? 'border-red-500' : 'border-[#EDEDED]'}`}
                            {...register("Message", { required: "El mensaje es requerido" })}></textarea>
                    </label>
                    {errors.Message && <p className='text-red-500'>{errors.Message.message}</p>}
                </div>
                <div>
                    <label htmlFor="Document" className='text-green-700 md:text-xl flex flex-col gap-2'>Archivo adjunto (opcional, solo archivos PDF o imágenes, máximo 2MB):
                        <input type="file"
                            className='file:p-2 file:px-4 file:cursor-pointer hover:file:bg-green-400 file:bg-green-700 file:text-white 
                            text-[#333] file:rounded-md file:border-2 file:transition file:duration-150
                            focus:outline-none file:focus:border-green-700 '
                            {...register("Document", {
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
                    {errors.Document && <p className='text-red-500'>{errors.Document.message}</p>}
                </div>
                <button type='submit' className='mt-6 bg-green-700 text-white rounded-md px-8 p-2 cursor-pointer hover:bg-green-400 transition duration-150'>Enviar</button>
                <p className='text-green-700 '>{confirm}</p>
            </form>
        </HeaderFooter>
    );
};

export default Contacto;