import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import Bienvenida from '../components/vistaSinAutenticacion/bienvenida';

const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            <Bienvenida />
        </HeaderFooter>
    );
};

export default Inicio;