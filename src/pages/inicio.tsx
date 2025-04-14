import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import Bienvenida from '../components/vistaSinAutenticacion/bienvenida';
import {Elegir} from '../components/vistaSinAutenticacion/elegir';
import { LlamadaAccion } from '../components/vistaSinAutenticacion/llamadaAccion';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            <Bienvenida />
            <Elegir/>
            <LlamadaAccion/>
        </HeaderFooter>
    );
};

export default Inicio;