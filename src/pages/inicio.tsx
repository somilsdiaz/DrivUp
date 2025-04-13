import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
<<<<<<< HEAD

const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            Este es el inicio
=======
import Bienvenida from '../components/vistaSinAutenticacion/bienvenida';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            <Bienvenida />
>>>>>>> main
        </HeaderFooter>
    );
};

export default Inicio;