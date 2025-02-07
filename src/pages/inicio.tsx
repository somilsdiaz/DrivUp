import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { NoticiasSection } from '../components/NoticiasSeccion';
import Bienvenida from '../components/bienvenida';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            <Bienvenida />
            <h2 className="text-3xl font-bold mb-6 text-center">Noticias Relevantes</h2>
            <NoticiasSection />
        </HeaderFooter>
    );
};

export default Inicio;