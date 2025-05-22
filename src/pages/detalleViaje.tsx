import { useEffect, useState } from "react";
import { DetallesViajeDatos } from "../components/detallesViajeDatos";
import HeaderFooter from "../layouts/headerFooter";
import { Menu } from 'lucide-react';
import DetallesViajeResponsive from "../components/detallesViajeResponsive";
import VisualizacionRuta from "../components/visualizacionRuta";
import { useLocation } from "react-router-dom";

type viajesProps = {
    conductor: string;
    pasajeros: string[];
    destinos: string[];
};


const viajes: viajesProps[] = [
    {
        conductor: "Carlos Pérez",
        pasajeros: ["Ana Gómez", "Luis Martínez", "Sofía Torres"],
        destinos: ["Centro Comercial Buenavista", "Estadio Metropolitano", "Parque Venezuela"]
    },
    {
        conductor: "María Rodríguez",
        pasajeros: ["Jorge Díaz", "Camila Herrera"],
        destinos: ["Universidad del Norte", "Malecón del Río", "Zoológico de Barranquilla"]
    },
    {
        conductor: "Juan Castillo",
        pasajeros: ["Pedro Suárez", "Lucía Mendoza", "Andrés Ramírez"],
        destinos: ["Aeropuerto Ernesto Cortissoz", "Plaza de la Paz", "Museo del Caribe"]
    }
];

export function DetalleViaje() {
    const [windowWidth, setWindow] = useState(window.innerWidth);
    const [openWindow,setOpenWindow]=useState<boolean>(false);
    const location = useLocation();
      const id = location.state as number

const closeMenu=()=>{
    setOpenWindow(false);
}

    useEffect(() => {
      const handleResize = () => setWindow(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize(); // Set initial width
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return(
        <HeaderFooter>
        <section className="flex relative">
            <VisualizacionRuta viajeId={id}/>
            {windowWidth > 600 && (<DetallesViajeDatos {...viajes[0]}/>)}
            {windowWidth < 600 && ( 
               <button 
               onClick={()=>setOpenWindow(true)}
               className="absolute right-5 bg-black text-white 
                   opacity-50 rounded-full  p-2 top-5 cursor-pointer z-20">
                 <Menu size={20}  />
               </button>)}
           { <DetallesViajeResponsive isMenuVisible={openWindow} closeMenu={closeMenu} data={viajes[0]}/>}
           
        </section>
       </HeaderFooter>
    );
}