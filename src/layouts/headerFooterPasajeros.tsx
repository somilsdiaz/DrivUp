import Header from "../components/vistaPasajeros/headerPasajero";

type MainLayoutProps = {
    children: React.ReactNode;
};

const HeaderFooterPasajeros = ({ children }: MainLayoutProps) => {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
        </div>
    );
};

export default HeaderFooterPasajeros;
