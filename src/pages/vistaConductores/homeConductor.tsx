import React, { useEffect, useState } from "react";
import HeaderFooter from "../../layouts/headerFooterConductores";
import { Link } from "react-router-dom";
import { useCurrentUserProfileImage } from "../../utils/useProfileImage";
import { FaCar, FaUsers, FaCalendarAlt, FaRoute, FaMoneyBillWave, FaShieldAlt, FaComments } from "react-icons/fa";

// Definición de beneficios para conductores
const benefits = [
    {
        icon: <FaMoneyBillWave className="w-8 h-8 text-[#F2B134]" />,
        title: "Ganancias Flexibles",
        desc: "Genera ingresos extras en tus tiempos libres"
    },
    {
        icon: <FaRoute className="w-8 h-8 text-[#2D5DA1]" />,
        title: "Rutas Eficientes",
        desc: "Optimiza tus recorridos y ahorra combustible"
    },
    {
        icon: <FaComments className="w-8 h-8 text-[#5AAA95]" />,
        title: "Comunicación Directa",
        desc: "Chatea con pasajeros para coordinar detalles"
    },
    {
        icon: <FaShieldAlt className="w-8 h-8 text-[#4A4E69]" />,
        title: "Seguridad Garantizada",
        desc: "Pasajeros verificados y soporte 24/7"
    }
];

// Acciones rápidas para conductores
const quickActions = [
    {
        to: "/dashboard/conductor/lista-viajes",
        icon: <FaCar className="w-10 h-10 text-[#2D5DA1]" />,
        title: "Buscar Viajes",
        desc: "Encuentra viajes cercanos y aumenta tus ganancias"
    },
    {
        to: "/dashboard/conductor/solicitudes",
        icon: <FaComments className="w-10 h-10 text-[#F2B134]" />,
        title: "Solicitudes",
        desc: "Gestiona las solicitudes de pasajeros interesados"
    },
    {
        to: "/dashboard/conductor/lista-pasajeros",
        icon: <FaUsers className="w-10 h-10 text-[#5AAA95]" />,
        title: "Pasajeros Disponibles",
        desc: "Explora pasajeros buscando transporte en tu zona"
    }
];

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
    const [stats, setStats] = useState({
        viajesCompletados: 0,
        pasajerosTransportados: 0,
        gananciasMes: 0
    });

    // Usar el hook para obtener la imagen de perfil
    const { profileImage, isLoading: loadingProfileImage } = useCurrentUserProfileImage();

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

                // Simular estadísticas del conductor
                // En un caso real, estas vendrían del backend
                setStats({
                    viajesCompletados: Math.floor(Math.random() * 50),
                    pasajerosTransportados: Math.floor(Math.random() * 100),
                    gananciasMes: Math.floor(Math.random() * 500000) + 100000
                });
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
            <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#e9eafc] pb-10">
                {/* Hero Section - Con un estilo diferente al de pasajeros */}
                <div className="relative w-full bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] py-12 px-4 md:px-0 mb-10 overflow-hidden shadow-lg">
                    {/* SVG decorativos */}
                    <svg className="absolute -top-10 -right-10 w-80 h-80 opacity-20 animate-float-slow" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F2B134" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.2,50.7C29.3,60,14.7,65.8,-0.7,66.7C-16.1,67.6,-32.2,63.6,-44.2,54.1C-56.2,44.6,-64.1,29.6,-67.2,13.2C-70.3,-3.2,-68.6,-21,-59.7,-33.2C-50.8,-45.4,-34.7,-52,-19.1,-59.2C-3.5,-66.4,11.6,-74.2,26.2,-74.2C40.8,-74.2,54.8,-66.2,44.8,-67.2Z" transform="translate(100 100)" />
                    </svg>
                    <svg className="absolute -bottom-16 left-0 w-96 h-96 opacity-10 animate-float-slow2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4ade80" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.2,50.7C29.3,60,14.7,65.8,-0.7,66.7C-16.1,67.6,-32.2,63.6,-44.2,54.1C-56.2,44.6,-64.1,29.6,-67.2,13.2C-70.3,-3.2,-68.6,-21,-59.7,-33.2C-50.8,-45.4,-34.7,-52,-19.1,-59.2C-3.5,-66.4,11.6,-74.2,26.2,-74.2C40.8,-74.2,54.8,-66.2,44.8,-67.2Z" transform="translate(100 100)" />
                    </svg>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left p-3 lg:p-0">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg animate-fade-in">¡Bienvenido Conductor{userData.name ? ", " + userData.name : ""}!</h1>
                            <p className="text-lg md:text-xl text-white/80 mb-4 animate-fade-in-slow">Tu plataforma para conectar con pasajeros y maximizar tus ganancias.</p>
                            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mt-2 animate-fade-in-slow">
                                {userRole === "conductor y pasajero" && (
                                    <Link to="/dashboard/pasajero">
                                        <button className="inline-flex items-center gap-2 bg-white/90 text-[#0a0d35] px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-[#F2B134]/90 hover:text-[#4A4E69] transition-all duration-200 text-sm border border-[#F2B134] animate-pop-in">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Ir a mi dashboard pasajero
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center animate-pop-in">
                                {/* Halo animado */}
                                <span className="absolute w-full h-full rounded-full bg-gradient-to-tr from-[#4ade80]/40 via-[#F2B134]/30 to-[#2D5DA1]/30 blur-2xl animate-pulse-slow"></span>
                                {/* Avatar */}
                                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/30 border-4 border-[#4ade80] flex items-center justify-center shadow-xl overflow-hidden">
                                    {loadingProfileImage ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                    ) : (
                                        <img
                                            src={profileImage}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback a SVG si la imagen falla en cargar
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                                    svg.setAttribute('class', 'w-20 h-20 md:w-28 md:h-28 text-white');
                                                    svg.setAttribute('fill', 'none');
                                                    svg.setAttribute('stroke', 'currentColor');
                                                    svg.setAttribute('strokeWidth', '2');
                                                    svg.setAttribute('viewBox', '0 0 24 24');
                                                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />';
                                                    parent.appendChild(svg);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <p className="text-white mt-4 font-medium animate-fade-in text-lg md:text-xl drop-shadow mr-3 lg:mr-0">
                                {userData.name} {userData.second_name} {userData.last_name} {userData.second_last_name}
                            </p>
                            <div className="flex flex-col items-center md:items-start gap-1 mt-1">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#4ade80]/90 text-[#0a0d35] font-bold uppercase tracking-wide text-xs shadow-md border border-[#fff]/30">{userRole || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas del conductor - Elemento distintivo */}
                <div className="max-w-5xl mx-auto mb-10 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border-b-4 border-[#2D5DA1]">
                            <div className="mb-3 p-3 bg-[#2D5DA1]/10 rounded-full">
                                <FaRoute className="w-8 h-8 text-[#2D5DA1]" />
                            </div>
                            <h4 className="font-bold text-[#4A4E69] mb-1">Viajes Completados</h4>
                            <p className="text-3xl font-bold text-[#2D5DA1]">{stats.viajesCompletados}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border-b-4 border-[#F2B134]">
                            <div className="mb-3 p-3 bg-[#F2B134]/10 rounded-full">
                                <FaUsers className="w-8 h-8 text-[#F2B134]" />
                            </div>
                            <h4 className="font-bold text-[#4A4E69] mb-1">Pasajeros Transportados</h4>
                            <p className="text-3xl font-bold text-[#F2B134]">{stats.pasajerosTransportados}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border-b-4 border-[#5AAA95]">
                            <div className="mb-3 p-3 bg-[#5AAA95]/10 rounded-full">
                                <FaMoneyBillWave className="w-8 h-8 text-[#5AAA95]" />
                            </div>
                            <h4 className="font-bold text-[#4A4E69] mb-1">Ganancias del Mes</h4>
                            <p className="text-3xl font-bold text-[#5AAA95]">${stats.gananciasMes.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-12">
                    {quickActions.map((action) => (
                        <Link to={action.to} key={action.title} className="group block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-7 text-center border-t-4 border-b-4 border-transparent hover:border-[#4ade80] cursor-pointer animate-fade-in-slow">
                            <div className="flex justify-center mb-4">
                                <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#0a0d35]/10 to-[#2D5DA1]/10 p-4 group-hover:scale-110 transition-transform duration-200">
                                    {action.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#0a0d35] mb-2 group-hover:text-[#2D5DA1] transition-colors duration-200">{action.title}</h3>
                            <p className="text-gray-500 mb-4 min-h-[48px]">{action.desc}</p>
                            <button className="mt-2 bg-[#0a0d35] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#2D5DA1] transition-all duration-200">Ir ahora</button>
                        </Link>
                    ))}
                </div>

                {/* Beneficios */}
                <div className="max-w-5xl mx-auto px-4 mb-12">
                    <h2 className="text-2xl font-bold text-[#0a0d35] mb-6 text-center animate-fade-in">Beneficios para Conductores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {benefits.map((b) => (
                            <div key={b.title} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 animate-fade-in-slow">
                                <div className="mb-3">{b.icon}</div>
                                <h4 className="font-bold text-[#0a0d35] mb-1">{b.title}</h4>
                                <p className="text-gray-500 text-sm">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Próximos viajes - Elemento distintivo */}
                <div className="max-w-5xl mx-auto px-4 mb-12">
                    <div className="bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCalendarAlt className="w-6 h-6 text-[#4ade80]" />
                            <h2 className="text-2xl font-bold">Próximos Viajes</h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <p className="text-white/80 text-center">No tienes viajes programados para hoy.</p>
                        </div>
                        <div className="flex justify-center">
                            <Link to="/dashboard/conductor/lista-viajes">
                                <button className="bg-[#4ade80] text-[#0a0d35] px-6 py-3 rounded-lg shadow hover:bg-[#4ade80]/90 transition-all duration-200 font-bold">
                                    Buscar Viajes Disponibles
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Footer */}
                <div className="max-w-3xl mx-auto text-center mt-10 animate-fade-in-slow">
                    <div className="bg-gradient-to-r from-[#F2B134] to-[#5AAA95] rounded-2xl py-8 px-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-white mb-2">¡Maximiza tus ganancias con DrivUp!</h3>
                        <p className="text-white/90 mb-4">Explora pasajeros disponibles, acepta solicitudes y programa tus viajes.</p>
                        <Link to="/dashboard/conductor/lista-pasajeros">
                            <button className="bg-white text-[#0a0d35] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#F8F9FA] transition-all duration-200">Ver Pasajeros</button>
                        </Link>
                    </div>
                </div>

                {/* Loading/Error Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-[#2D5DA1] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <span className="text-[#4A4E69] font-semibold">Cargando información...</span>
                        </div>
                    </div>
                )}
                {error && !loading && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center">
                            <span className="text-red-500 font-semibold">{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </HeaderFooter>
    );
}

export default HomeConductor;