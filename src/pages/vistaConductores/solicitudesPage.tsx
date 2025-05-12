import Header from "../../components/vistaConductores/headerConductor";
import ChatPage from "../../components/chatPage";
import ListaPasajeros from "../../components/asidePasajeros";

const SolicitudesPage = () => {
    return (
        <main>
            <Header />

            {/* Contenedor en fila */}
            <div className="flex flex-col lg:flex-row p-4">
                {/* Chat principal */}
                <div className="w-full md:flex-1">
                    <ChatPage />
                </div>
                {/* Aside a la derecha */}
                <div className="w-auto lg:w-56 xl:w-64 p-4 justify-center items-center flex lg:flex-none">
                    <ListaPasajeros />
                </div>
            </div>

        </main>
    )
}

export default SolicitudesPage;
