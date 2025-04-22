import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import { Link } from "react-router-dom";

const HomePasajeros = () => {
    return (
        <HeaderFooterPasajeros>
            <section>
                {/* Aqui se debe implementar una logica tal que  que si el co usuario todavia no es conductor  se muestra el boton de registrarse como conductor pero si y ya es conductor en vez de mostrar el boton de registrarse como conductor se muestra el boton de dashboard de conductor   */}
                <Link to="/driver-register">
                    <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-2 lg:px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
                        Registrarse como conductor
                    </button>
                </Link>
            </section>
        </HeaderFooterPasajeros>
    );
}
export default HomePasajeros;