import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import Bienvenida from '../components/vistaSinAutenticacion/bienvenida';
import {Elegir} from '../components/vistaSinAutenticacion/elegir';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            <Bienvenida />
            <Elegir/>
        </HeaderFooter>
    );
};

export default Inicio;