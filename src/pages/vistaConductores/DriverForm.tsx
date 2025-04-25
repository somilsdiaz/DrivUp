import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const DriverForm  = () => {

    return (
     <div>
         {/* Main Content */}
         <main className="flex-1 p-8">
         <h1 className="text-2xl font-bold mb-6">Preferencias de viaje</h1>
         
         {/* Aquí agregas los formularios o componentes que quieras */}
         <p className="text-gray-600">Aquí puedes personalizar tus preferencias de viaje.</p>

         {/* Ejemplo de una preferencia */}
         <div className="mt-6">
             <label className="block mb-2 font-medium">Modo de transporte preferido</label>
             <select className="border p-2 rounded w-full max-w-md">
                 <option value="carro">Carro</option>
                 <option value="moto">Moto</option>
                 <option value="bicicleta">Bicicleta</option>
                 <option value="a pie">A pie</option>
             </select>
         </div>
     </main>
    </div>
    );
};

export default DriverForm;