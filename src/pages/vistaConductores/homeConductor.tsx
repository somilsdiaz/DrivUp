import React from "react"
import HeaderFooter from "../../layouts/headerFooterConductores";
import { Link } from "react-router-dom";

const HomeConductor: React.FC = () => {
    return (
        <HeaderFooter>
            <section>
                <Link to="/dashboard/pasajero">
                    <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-2 lg:px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
                        Regresar a la pagina de pasajeros
                    </button>
                </Link>
            </section>
        </HeaderFooter>
    );

}
export default HomeConductor;