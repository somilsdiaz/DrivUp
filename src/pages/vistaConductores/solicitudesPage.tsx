import Header from "../../components/vistaConductores/headerConductor";
import ChatPage from "../../components/chatPage";
import ListaPasajeros from "../../components/asidePasajeros";

const SolicitudesPage = () => {
    return (
        <main>
            <Header />

            {/* Contenedor en fila */}
            <div className="flex flex-col md:flex-row p-4 ">
                {/* Chat principal */}
                <div className="w-full md:flex-1">
                    <ChatPage />
                </div>
                {/* Aside a la derecha */}
                <div className="w-auto md:w-48 lg:w-56 xl:w-64 p-4">
                    <ListaPasajeros />
                </div>
            </div>

        </main>
    )
}

export default SolicitudesPage;
