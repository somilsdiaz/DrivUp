import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DatosProps, DatosUpdateProps } from "../../core/interfaces/conductorProps";
import { usePatchConductor } from "../../hooks/usePatchConductor";
import { getUserId } from "../../utils/auth";


interface Props {
    conductordatos: DatosProps;
    close: () => void;
}

type FormValues = {
    modelo_vehiculo: string;
    marca_vehiculo: string;
    color_vehiculo: string;
    año_vehiculo: number;
    capacidad_de_pasajeros: number;
    origen: string;
    destino: string;
    descripcion: string;
};



const ActualizarDatosConductor: React.FC<Props> = ({ conductordatos, close }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            ...conductordatos,
        },
    });

    const [error, setError] = useState<string>("");

    const {mutate: updateDatos}=usePatchConductor(setError)

    const [modeloVehiculo, setModeloVehiculo] = useState(conductordatos.modelo_de_vehiculo);
    const [marcaVehiculo, setMarcaVehiculo] = useState(conductordatos.marca_de_vehiculo);
    const [colorVehiculo, setColorVehiculo] = useState(conductordatos.color_del_vehiculo);
    const [anioVehiculo, setAnioVehiculo] = useState(conductordatos.año_del_vehiculo);
    const [capacidadPasajeros, setCapacidadPasajeros] = useState(conductordatos.capacidad_de_pasajeros);

    const [origen, setOrigen] = useState(conductordatos.origen_aproximado);
    const [destino, setDestino] = useState(conductordatos.destino_aproximado);
    const [descripcion, setDescripcion] = useState(conductordatos.descripcion);

    const onSubmit = (data: FormValues) => {
       try{
       const updatedData: DatosUpdateProps = {
           id: conductordatos.id,
           user_id:Number(getUserId()),
              modelo_de_vehiculo: data.modelo_vehiculo,
                marca_de_vehiculo: data.marca_vehiculo,
                color_del_vehiculo: data.color_vehiculo,
                año_del_vehiculo: data.año_vehiculo,
                capacidad_de_pasajeros: data.capacidad_de_pasajeros,
                origen_aproximado: data.origen,
                destino_aproximado: data.destino,
                descripcion: data.descripcion,
       }

       updateDatos(updatedData)
       setError("")
        close();
     }catch (error) {
    setError("Error al enviar el comentario. Vuelve a intentarlo más tarde.")
    }
    };

    return (
        <form
            className="max-w-lg mx-auto p-8 rounded-lg bg-gray-100 shadow-md"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-[#4A4E69]">Actualizar Datos del Vehículo</h2>
            <label className="block mb-4">
                Modelo:
                <input
                    type="text"
                    {...register("modelo_vehiculo", { required: true })}
                    value={modeloVehiculo}
                    onChange={e => setModeloVehiculo(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.modelo_vehiculo && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Marca:
                <input
                    type="text"
                    {...register("marca_vehiculo", { required: true })}
                    value={marcaVehiculo}
                    onChange={e => setMarcaVehiculo(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.marca_vehiculo && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Color:
                <input
                    type="text"
                    {...register("color_vehiculo", { required: true })}
                    value={colorVehiculo}
                    onChange={e => setColorVehiculo(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.color_vehiculo && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Año:
                <input
                    type="number"
                    {...register("año_vehiculo", { required: true })}
                    value={anioVehiculo}
                    onChange={e => setAnioVehiculo(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.año_vehiculo && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Capacidad de Pasajeros:
                <input
                    type="number"
                    {...register("capacidad_de_pasajeros", { required: true, min: 1 })}
                    value={capacidadPasajeros}
                    onChange={e => setCapacidadPasajeros(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.capacidad_de_pasajeros && (
                    <span className="text-red-500 text-sm">Debe ser mayor a 0</span>
                )}
            </label>

            <h2 className="text-2xl font-bold mb-6 mt-8 text-center text-[#4A4E69]">Datos de la Ruta</h2>
            <label className="block mb-4">
                Origen:
                <input
                    type="text"
                    {...register("origen", { required: true })}
                    value={origen}
                    onChange={e => setOrigen(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.origen && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Destino:
                <input
                    type="text"
                    {...register("destino", { required: true })}
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.destino && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <label className="block mb-4">
                Descripción:
                <textarea
                    {...register("descripcion", { required: true })}
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.descripcion && (
                    <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
            </label>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={()=>{setError(""); close();}}
                    className="cursor-pointer px-4 py-2 bg-[#4A4E69] text-white rounded hover:bg-[#4A4E69]/90 transition-all transform hover:scale-110 group"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="p-2 bg-[#F2B134] w-6/12 mx-auto text-[#4A4E69] font-bold
         rounded-sm cursor-pointer hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group"
                >
                    Actualizar
                </button>
                <span>{error !== "" && (<span className="text-red-500 text-sm">{error}</span>)}</span>
            </div>
        </form>
    );
};

export default ActualizarDatosConductor;