import { useLocation } from "react-router-dom";
import { DetallesConductor } from "../components/vistaPasajeros/detallesConductor/detallesConductor";
import { apiConductorProps } from "../core/interfaces/conductorProps";
import HeaderFooterPasajeros from "../layouts/headerFooterPasajeros";

const PageDetallesConductor=()=>{
    const location=useLocation();
    const conductor=location.state as apiConductorProps;
    return (
        <HeaderFooterPasajeros>
        <DetallesConductor {...conductor}/>
        </HeaderFooterPasajeros>
    );
}

export default PageDetallesConductor;