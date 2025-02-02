import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { NoticiasSection } from '../components/NoticiasSeccion';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            Este es el inicio
            <NoticiasSection />
        </HeaderFooter>
    );
};

export default Inicio;