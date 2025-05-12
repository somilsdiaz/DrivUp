import { FormularioViajes } from "../components/vistaPasajeros/formularioViajes";
import HeaderFooterPasajeros from "../layouts/headerFooterPasajeros";



export function PreferenciasViajes() {
    
    return (
        <HeaderFooterPasajeros>
            <section className="p-4">
            <FormularioViajes/>
        </section>
        </HeaderFooterPasajeros>
    );
}