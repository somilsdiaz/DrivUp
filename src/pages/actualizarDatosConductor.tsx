
import { DatoConductor } from "../components/vistaConductores/datoConductor";
import HeaderFooterConductores from "../layouts/headerFooterConductores";

export function CambiarDatosConductor() {
    return(
         <HeaderFooterConductores>
        <section className="p-4">
            <DatoConductor/>
        </section>
        </HeaderFooterConductores>
    );
}