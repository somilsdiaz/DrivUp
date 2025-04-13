import React from 'react';
<<<<<<< HEAD
import Header from '../components/header';
import Footer from '../components/footer';
=======
import Header from '../components/vistaSinAutenticacion/header';
import Footer from '../components/vistaSinAutenticacion/footer';
>>>>>>> main

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