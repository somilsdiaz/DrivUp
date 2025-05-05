import Header from "../../components/vistaConductores/headerConductor";
import ChatPage from "../../components/chatPage";
import ListaPasajeros from "../../components/asidePasajeros";

const SolicitudesPage = () => {
    return (
        <main>
        <Header />

        {/* Contenedor en fila */}
        <div className="flex p-4 gap-6">
            {/* Chat principal */}
            <div className="flex-1">
                <ChatPage />
            </div>

            {/* Aside a la derecha */}
            <div className="w-full md:w-80">
                <ListaPasajeros />
            </div>
        </div>
    </main>
    )
}

export default SolicitudesPage;
