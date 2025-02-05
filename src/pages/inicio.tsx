import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { NoticiasSection } from '../components/NoticiasSeccion';
const Inicio: React.FC = () => {
    return (
        <HeaderFooter>
            Este es el inicio
            <h2 className="text-3xl font-bold mb-6 text-center">Noticias Relevantes</h2>
            <NoticiasSection />
        </HeaderFooter>
    );
};

export default Inicio;