import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

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

export default MainLayout;