import React from "react"
import HeaderFooter from "../../layouts/headerFooterConductores";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeConductor: React.FC = () => {
    const [userData, setUserData] = useState({
        id: null,
        name: "",
        second_name: "",
        last_name: "",
        second_last_name: ""
    });
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                // Fetch role information
                const roleResponse = await fetch(`http://localhost:5000/usuarios/${userId}/role`);
                if (!roleResponse.ok) {
                    throw new Error("Error al obtener el rol del usuario");
                }
                const roleData = await roleResponse.json();
                setUserRole(roleData.role);

                // Fetch user information
                const userResponse = await fetch(`http://localhost:5000/usuario/${userId}`);
                if (!userResponse.ok) {
                    throw new Error("Error al obtener la información del usuario");
                }
                const userInfo = await userResponse.json();
                setUserData(userInfo);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    return (
        <HeaderFooter>
            <section className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
                        <span className="ml-2 text-gray-700">Cargando información...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4">{error}</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-[#4A4E69] mb-4">Bienvenido(a)</h2>
                        <div className="mb-6">
                            <p className="text-lg font-medium">
                                {userData.name} {userData.second_name} {userData.last_name} {userData.second_last_name}
                            </p>
                            <p className="text-sm text-gray-500">ID de usuario: {userData.id}</p>
                            <p className="text-sm text-gray-500">Rol: {userRole}</p>
                        </div>
                        <Link to="/dashboard/pasajero">
                            <button className="bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/90 px-2 lg:px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
                                Regresar a la pagina de pasajeros
                            </button>
                        </Link>
                    </div>
                )}
            </section>
        </HeaderFooter>
    );

}
export default HomeConductor;