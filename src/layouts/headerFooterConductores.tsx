import React from 'react';
import Header from '../components/vistaConductores/headerConductor'

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
        </div>
    );
};

export default HeaderFooter;