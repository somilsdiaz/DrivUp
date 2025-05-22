import { useEffect, useState } from "react";
import { DetallesViajeDatos } from "../components/detallesViajeDatos";
import HeaderFooterConductores from "../layouts/headerFooterConductores";
import { Menu } from 'lucide-react';
import DetallesViajeResponsive from "../components/detallesViajeResponsive";
import VisualizacionRuta from "../components/visualizacionRuta";
import { useLocation } from "react-router-dom";
import { viajeProps } from "../core/interfaces/detallesViajesProps";



export function DetalleViaje() {
    const [windowWidth, setWindow] = useState(window.innerWidth);
    const [openWindow,setOpenWindow]=useState<boolean>(false);
    const location = useLocation();
      const data = location.state as viajeProps

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
        <HeaderFooterConductores>
        <section className="flex relative">
            <VisualizacionRuta viajeId={data.id}/>
            {windowWidth > 600 && (<DetallesViajeDatos {...data}/>)}
            {windowWidth < 600 && ( 
               <button 
               onClick={()=>setOpenWindow(true)}
               className="absolute right-5 bg-black text-white 
                   opacity-50 rounded-full  p-2 top-5 cursor-pointer z-20">
                 <Menu size={20}  />
               </button>)}
           { <DetallesViajeResponsive isMenuVisible={openWindow} closeMenu={closeMenu} data={data}/>}
           
        </section>
       </HeaderFooterConductores>
    );
}