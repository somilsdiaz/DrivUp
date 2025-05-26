import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProfileImage } from "../../utils/useProfileImage";

const benefits = [
    {
        icon: (
            <svg className="w-8 h-8 text-[#2D5DA1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        ),
        title: "Viajes Seguros",
        desc: "Conductores verificados y rutas monitoreadas para tu tranquilidad."
    },
    {
        icon: (
            <svg className="w-8 h-8 text-[#F2B134]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" /></svg>
        ),
        title: "Comunicación Directa",
        desc: "Chatea con conductores y pasajeros para coordinar detalles."
    },
    {
        icon: (
            <svg className="w-8 h-8 text-[#5AAA95]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 4h4m-2 0v4m0 0a8 8 0 100-16 8 8 0 000 16z" /></svg>
        ),
        title: "Flexibilidad Total",
        desc: "Solicita viajes, elige conductores o deja que te contacten."
    },
    {
        icon: (
            <svg className="w-8 h-8 text-[#4A4E69]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
        ),
        title: "Innovación",
        desc: "Tecnología de punta para una experiencia única y eficiente."
    }
];

const quickActions = [
    {
        to: "/dashboard/pasajero/mi-bandeja-de-mensajes",
        icon: (
            <svg className="w-10 h-10 text-[#2D5DA1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6.79a2 2 0 00.553 1.385l7 7a2 2 0 002.894 0l7-7A2 2 0 0021 12.79z" /></svg>
        ),
        title: "Bandeja de Mensajes",
        desc: "Comunícate con conductores y otros pasajeros en tiempo real."
    },
    {
        to: "/dashboard/pasajero/lista-conductores",
        icon: (
            <svg className="w-10 h-10 text-[#5AAA95]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0zm6 4v6m0 0a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6a2 2 0 012-2h4a2 2 0 012 2z" /></svg>
        ),
        title: "Conductores Disponibles",
        desc: "Explora y elige entre los mejores conductores para tu viaje."
    },
    {
        to: "/dashboard/pasajero/solicitar-viaje",
        icon: (
            <svg className="w-10 h-10 text-[#F2B134]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0a2 2 0 00-2-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2h3a4 4 0 014 4v2m0 0v2m0-2h-4" /></svg>
        ),
        title: "Solicitar Viaje",
        desc: "Configura tu viaje y obtén una estimación al instante."
    }
];

const HomePasajeros = () => {
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
    
    // Usar el hook para obtener la imagen de perfil
    const { profileImage, isLoading: loadingProfileImage } = useProfileImage(userData.id);

    // Tarjetas dinámicas según el rol
    const getQuickActions = () => {
        let actions = [...quickActions];
        return actions;
    };

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
        <HeaderFooterPasajeros>
            <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#e9eafc] pb-10">
                {/* Hero Section */}
                <div className="relative w-full bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] py-12 px-4 md:px-0 mb-10 overflow-hidden shadow-lg">
                    {/* SVG decorativo de fondo */}
                    <svg className="absolute -top-10 -left-10 w-80 h-80 opacity-30 animate-float-slow" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F2B134" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.2,50.7C29.3,60,14.7,65.8,-0.7,66.7C-16.1,67.6,-32.2,63.6,-44.2,54.1C-56.2,44.6,-64.1,29.6,-67.2,13.2C-70.3,-3.2,-68.6,-21,-59.7,-33.2C-50.8,-45.4,-34.7,-52,-19.1,-59.2C-3.5,-66.4,11.6,-74.2,26.2,-74.2C40.8,-74.2,54.8,-66.2,44.8,-67.2Z" transform="translate(100 100)" />
                    </svg>
                    <svg className="absolute -bottom-16 right-0 w-96 h-96 opacity-20 animate-float-slow2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fff" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.2,50.7C29.3,60,14.7,65.8,-0.7,66.7C-16.1,67.6,-32.2,63.6,-44.2,54.1C-56.2,44.6,-64.1,29.6,-67.2,13.2C-70.3,-3.2,-68.6,-21,-59.7,-33.2C-50.8,-45.4,-34.7,-52,-19.1,-59.2C-3.5,-66.4,11.6,-74.2,26.2,-74.2C40.8,-74.2,54.8,-66.2,44.8,-67.2Z" transform="translate(100 100)" />
                    </svg>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left p-3 lg:p-0">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg animate-fade-in">¡Bienvenido{userData.name ? ", " + userData.name : ""}!</h1>
                            <p className="text-lg md:text-xl text-white/80 mb-4 animate-fade-in-slow">Tu experiencia de viaje comienza aquí.</p>
                            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mt-2 animate-fade-in-slow">
                                {userRole === "conductor y pasajero" && (
                                    <Link to="/dashboard/conductor">
                                        <button className="inline-flex items-center gap-2 bg-white/90 text-[#2D5DA1] px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-[#F2B134]/90 hover:text-[#4A4E69] transition-all duration-200 text-sm border border-[#F2B134] animate-pop-in">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v4h-1m4 0h-1v4h-1" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                                            Ir a mi dashboard conductor
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center animate-pop-in">
                                {/* Halo animado */}
                                <span className="absolute w-full h-full rounded-full bg-gradient-to-tr from-[#F2B134]/40 via-[#5AAA95]/30 to-[#2D5DA1]/30 blur-2xl animate-pulse-slow"></span>
                                {/* Avatar */}
                                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/30 border-4 border-[#F2B134] flex items-center justify-center shadow-xl overflow-hidden">
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
                            <p className="text-white mt-4 font-medium animate-fade-in text-lg md:text-xl drop-shadow mr-3 lg:mr-0">{userData.name} {userData.second_name} {userData.last_name} {userData.second_last_name}
                                
                            </p>
                            <div className="flex flex-col items-center md:items-start gap-1 mt-1">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F2B134]/90 text-[#4A4E69] font-bold uppercase tracking-wide text-xs shadow-md border border-[#fff]/30">{userRole || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-12">
                    {getQuickActions().map((action) => (
                        <Link to={action.to} key={action.title} className="group block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-7 text-center border-t-4 border-b-4 border-transparent hover:border-[#F2B134] cursor-pointer animate-fade-in-slow">
                            <div className="flex justify-center mb-4">
                                <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#F2B134]/20 to-[#2D5DA1]/10 p-4 group-hover:scale-110 transition-transform duration-200">
                                    {action.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#4A4E69] mb-2 group-hover:text-[#F2B134] transition-colors duration-200">{action.title}</h3>
                            <p className="text-gray-500 mb-4 min-h-[48px]">{action.desc}</p>
                            <button className="mt-2 bg-[#F2B134] text-[#4A4E69] px-4 py-2 rounded-md font-semibold shadow hover:bg-[#F2B134]/90 transition-all duration-200">Ir ahora</button>
                        </Link>
                    ))}
                </div>

                {/* Sección Convertirse a Conductor */}
                {userRole === "pasajero" && (
                    <div className="max-w-3xl mx-auto mb-10 px-4 animate-fade-in-slow">
                        <div className="bg-gradient-to-r from-[#F2B134]/90 to-[#5AAA95]/80 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 p-8 border border-[#F2B134]/30">
                            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white/30 border-4 border-[#F2B134] shadow-lg animate-pop-in">
                                <svg className="w-12 h-12 text-[#2D5DA1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow">¿Te gustaría ganar dinero extra?</h3>
                                <p className="text-white/90 mb-4">Conviértete en conductor de DrivUp y accede a nuevas oportunidades. ¡Es fácil, rápido y seguro!</p>
                                <Link to="/driver-register">
                                    <button className="bg-white text-[#4A4E69] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#F2B134] hover:text-[#4A4E69] transition-all duration-200">Registrarse como conductor</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Beneficios */}
                <div className="max-w-5xl mx-auto px-4 mb-12">
                    <h2 className="text-2xl font-bold text-[#2D5DA1] mb-6 text-center animate-fade-in">¿Por qué elegir DrivUp?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {benefits.map((b) => (
                            <div key={b.title} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 animate-fade-in-slow">
                                <div className="mb-3">{b.icon}</div>
                                <h4 className="font-bold text-[#4A4E69] mb-1">{b.title}</h4>
                                <p className="text-gray-500 text-sm">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Footer */}
                <div className="max-w-3xl mx-auto text-center mt-10 animate-fade-in-slow">
                    <div className="bg-gradient-to-r from-[#F2B134] to-[#5AAA95] rounded-2xl py-8 px-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-white mb-2">¡Comienza tu próxima aventura con DrivUp!</h3>
                        <p className="text-white/90 mb-4">Solicita un viaje, contacta conductores o chatea con otros usuarios. ¡Todo desde un solo lugar!</p>
                        <Link to="/dashboard/pasajero/solicitar-viaje">
                            <button className="bg-white text-[#4A4E69] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#F8F9FA] transition-all duration-200">Solicitar Viaje</button>
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
        </HeaderFooterPasajeros>
    );
}

export default HomePasajeros;