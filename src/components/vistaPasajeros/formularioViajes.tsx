

import { useForm } from "react-hook-form";
import { sendRutaUsuarioProps } from "../../core/interfaces/rutaUsuarioProps";
import { getUserId } from "../../utils/auth";
import { useCrearRutaUsuario } from "../../hooks/useCreateRutaUsuario";
import { useState } from "react";



export function FormularioViajes() {
    const [error,setError]=useState<string>("");
    const {mutate:crearRutaUsuario}=useCrearRutaUsuario(setError);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<sendRutaUsuarioProps>();

    const onSubmit = (data: sendRutaUsuarioProps) => {
        const idUser=getUserId();
        if(Number(data.hora)<=0 || Number(data.hora)>=13){
            setError("La hora debe ser entre 0 y 13");
            return null;
        }
       if(idUser!==null){
         const ruta={
            user_id: Number(idUser),
            origen: data.origen,
            destino: data.destino,
            dias: data.dias.join(" "),
            hora:`${data.hora}:${data.minutos} ${data.jornada}`,
            descripcion: data.descripcion,
        }
        crearRutaUsuario(ruta);
        reset();
       }else{
        setError("No se ha podido crear la ruta");
        
       }
    };
  return (
    <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-11/12 md:w-5/6 mx-auto p-6 bg-[#f9f9f9] text-[#2D5DA1] border-2 border-[#dfdfdf] rounded-lg shadow-md"
        >
    <h1 className="text-[#4A4E69] text-4xl text-center font-bold mb-8">Preferencias de Viajes</h1>
            <fieldset className="mb-4 flex max-[600px]:flex-col gap-10">
                <div >
                <label htmlFor="origen" className="block text-sm font-medium">
                    Lugar de Origen:
                </label>
                <input
                    id="origen"
                    className="w-full mt-1 p-2 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                    {...register("origen", { required: "El lugar de origen es requerido" })}
                />
                {errors.origen && <p className="text-red-600 text-sm mt-1">{errors.origen.message}</p>}
            </div>
           

            <div >
                <label htmlFor="destino" className="block text-sm font-medium">
                    Lugar de Destino:
                </label>
                <input
                    id="destino"
                    className="w-full mt-1 p-2 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                    {...register("destino", { required: "El lugar de destino es requerido" })}
                />
                {errors.destino && <p className="text-red-600 text-sm mt-1">{errors.destino.message}</p>}
            </div>
             </fieldset>

            <div className="mb-4">
                <label className="block text-sm font-medium">Días de la semana</label>
                <div className="flex gap-10 flex-wrap max-[620px]:justify-between mt-2">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                        <label key={dia} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={dia}
                                className="cursor-pointer text-[#2D5DA1] focus:ring-[#2D5DA1]"
                                {...register("dias", { required: "Debe seleccionar al menos un día" })}
                            />
                            <span>{dia}</span>
                        </label>
                    ))}
                </div>
                {errors.dias && <p className="text-red-600 text-sm mt-1">{errors.dias.message}</p>}
            </div>

            <fieldset className="flex gap-4 mb-4 items-center w-1/4">
                <div className="flex-1">
                    <label htmlFor="hora" className="block text-sm font-medium">
                        Hora:
                    </label>
                    <input
                        type="number"
                        defaultValue={1}
                        min="1"
                        max="12"
                        id="hora"
                        className="w-full mt-1 p-1 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                        {...register("hora", {
                            required: "La hora es requerida",
                            validate: (value) =>
                                Number(value) > 0 && Number(value) < 13 || "La hora debe ser un número entre 0 y 13",
                        })}
                    />
                    {errors.hora && <p className="text-red-600 text-sm mt-1">{errors.hora.message}</p>}    {errors.hora && <p className="text-red-600 text-sm mt-1">{errors.hora.message}</p>}
                </div>

                <div className="flex-1">
                    <label htmlFor="minutos" className="block text-sm font-medium">
                        Minutos:
                    </label>
                    <select
                        id="minutos"
                        className="w-full mt-1 p-1 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                        {...register("minutos", { required: "Los minutos son requeridos" })}
                    >
                        {["00", "15", "30", "45"].map((min) => (
                            <option key={min} value={min}>
                                {min}
                            </option>
                        ))}
                    </select>
                    {errors.minutos && <p className="text-red-600 text-sm mt-1">{errors.minutos.message}</p>}
                </div>

                <div className="flex-1">
                    <label htmlFor="jornada" className="block text-sm font-medium">
                        Jornada:
                    </label>
                    <select
                        id="jornada"
                        className="w-full mt-1 p-1 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                        {...register("jornada", { required: "La jornada es requerida" })}
                    >
                        {["a.m", "p.m"].map((period) => (
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                    {errors.jornada && <p className="text-yellow-400 text-sm mt-1">{errors.jornada.message}</p>}
                </div>
            </fieldset>

            <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-medium">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    className="w-full mt-1 p-2 border border-[#2D5DA1] rounded focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]"
                    {...register("descripcion", { required: "La descripción es requerida" })}
                />
                {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>}
            </div>
            {error!==""&&(<div className="text-red-600 border border-red-600 bg-red-300 text-center my-2 mx-auto w-3/4 rounded-md"><span>{error}</span></div>)}
            <button
                type="submit"
                className="cursor-pointer w-full py-2 px-4 bg-[#2D5DA1] text-white font-semibold rounded hover:bg-[#1E4A8A] focus:outline-none focus:ring-2 focus:ring-[#1E4A8A]"
            >
                Enviar
            </button>
        </form>
  );
}