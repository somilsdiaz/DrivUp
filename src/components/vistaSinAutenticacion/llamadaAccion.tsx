import { Link } from "react-router-dom";

export function LlamadaAccion(){
    return(
        <section className="flex flex-col gap-4 justify-center p-4 text-center bg-[#2D5DA1] text-white">
            <h2 className="text-2xl font-bold ">Únete a DrivUp hoy mismo</h2>
            <p>Ya sea que necesites un viaje o quieras
            generar ingresos como conductor, DrivUp es tu mejor opción.</p>
            <div className="flex gap-2 justify-center items-center">
                <button className="p-2 text-[#4A4E69] font-bold bg-[#F2B134] rounded-sm cursor-pointer hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group">
                <Link to="/register">Registrate aqui</Link>
                </button>
                </div>
        </section>
    );
}