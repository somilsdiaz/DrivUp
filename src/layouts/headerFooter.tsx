import React from 'react';
import Header from '../components/vistaSinAutenticacion/header';
import Footer from '../components/vistaSinAutenticacion/footer';

type MainLayoutProps = {
    children: React.ReactNode;
};

const HeaderFooter: React.FC<MainLayoutProps> = ({ children }) => {

    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default HeaderFooter;