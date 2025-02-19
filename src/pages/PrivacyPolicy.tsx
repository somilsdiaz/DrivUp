import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"
import HeaderFooter from "../layouts/headerFooter";


const sections = [
    { id: "intro", title: "Introducción" },
    { id: "recoleccion", title: "1. Información recolectada" },
    { id: "uso", title: "2. Uso de la información" },
    { id: "compartir", title: "3. Compartir Información" },
    { id: "seguridad", title: "4. Seguridad de la Información" },
    { id: "derechos", title: "5. Derechos del Usuario" },
    { id: "cambios", title: "6. Cambios en las Políticas de Privacidad" },
    { id: "contacto", title: "Contacto" },
];

export default function PrivacyPolicy() {
    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        const headerOffset = 97; // altura del header
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <HeaderFooter>
            <div className="bg-white text-gray-800 min-h-screen scroll-pt-48">
                {/* Sidebar */}
                <nav
                    className={`bg-gray-100 w-64 h-screen fixed top-20 left-0 p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out hidden md:block`}
                >
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={(e) => handleScrollToSection(e, section.id)}
                            className="block py-2 text-gray-800 hover:text-blue-500"
                        >
                            {section.title}
                        </a>
                    ))}
                </nav>

                {/* Main Content */}
                <main id="intro"  className="ml-0 md:ml-64 p-8 max-w-3xl">
                    <h1 className="text-4xl font-bold text-red-600 mb-6">
                        Política de privacidad de UniBus
                    </h1>

                    <nav className="mb-8">
                        <ol className="flex items-center text-sm">
                            <li>
                                <Link to="/" className="text-blue-500 hover:underline">
                                    Página de inicio
                                </Link>
                            </li>
                            <ChevronRight className="mx-2 w-4 h-4 text-gray-600" />
                            <li className="text-gray-600">Políticas de privacidad</li>
                        </ol>
                    </nav>

                    <section className="mb-8 text-justify">
                        <p>
                            Bienvenido/a a UniBus , la plataforma digital diseñada para optimizar y mejorar tu experiencia en el transporte público universitario. En UniBus, valoramos profundamente tu privacidad y estamos comprometidos con proteger la información personal que nos confías. Este documento describe detalladamente nuestras políticas de privacidad, explicando qué datos recopilamos, cómo los utilizamos, almacenamos y protegemos, así como tus derechos en relación con esta información.
                        </p>

                        <p className="pt-3">
                            Te recomendamos leer cuidadosamente este documento para comprender plenamente nuestras prácticas de privacidad. Al utilizar nuestros servicios, aceptas las prácticas descritas en estas políticas.</p>
                    </section>

                    <section id="recoleccion" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            1. Información Recopilada
                        </h2>
                        <p>
                            Para proporcionarte una experiencia personalizada y garantizar el
                            correcto funcionamiento de nuestros servicios, recopilamos ciertos
                            datos personales durante tu registro y uso de la plataforma. Estos
                            datos incluyen:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-justify">
                            <li>
                                <strong>Nombre y Apellidos:</strong> Para identificarte de manera
                                clara dentro de la plataforma.
                            </li>
                            <li>
                                <strong>Número y Tipo de Identificación:</strong> Para verificar
                                tu identidad y cumplir con requisitos legales.
                            </li>
                            <li>
                                <strong>Fecha de Nacimiento:</strong> Para asegurar que cumples
                                con los requisitos de edad necesarios para utilizar nuestros
                                servicios.
                            </li>
                            <li>
                                <strong>Universidad:</strong> Para personalizar las rutas y
                                servicios disponibles según tu institución educativa.
                            </li>
                            <li>
                                <strong>Ubicación:</strong> Para optimizar las rutas y ofrecerte
                                información precisa sobre disponibilidad y tiempos de espera.
                            </li>
                            <li>
                                <strong>Correo Electrónico:</strong> Para mantenerte informado/a
                                sobre actualizaciones, notificaciones y confirmaciones
                                relacionadas con tus solicitudes de transporte.
                            </li>
                            <li>
                                <strong>Contraseña:</strong> Para garantizar la seguridad de tu
                                cuenta y proteger el acceso no autorizado.
                            </li>
                        </ul>
                    </section>

                    {/* Resto de las secciones */}
                    <section id="uso" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            2. Uso de la Información
                        </h2>
                        <p>
                            La información recopilada se utiliza exclusivamente para los
                            siguientes propósitos:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-justify">
                            <li>
                                <strong>Personalización del Servicio:</strong> Adaptar las rutas
                                y notificaciones a tus necesidades específicas.
                            </li>
                            <li>
                                <strong>Gestión de Cuentas:</strong> Facilitar el registro,
                                autenticación y administración de tu cuenta en la plataforma.
                            </li>
                            <li>
                                <strong>Optimización Operativa:</strong> Analizar patrones de
                                demanda para mejorar la distribución de la flota y reducir
                                tiempos de espera.
                            </li>
                            <li>
                                <strong>Comunicaciones:</strong> Enviar notificaciones
                                importantes, confirmaciones de solicitud y actualizaciones sobre
                                el estado de tus rutas.
                            </li>
                            <li>
                                <strong>Cumplimiento Legal:</strong> Cumplir con leyes y
                                regulaciones aplicables.
                            </li>
                        </ul>
                    </section>

                    <section id="compartir" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            3. Compartir Información
                        </h2>
                        <p>
                            Nos comprometemos a no vender, alquilar ni compartir tu información personal con terceros sin tu consentimiento expreso, excepto en los siguientes casos:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-justify">
                            <li>
                                <strong>Proveedores de Servicios:</strong> Podemos compartir información con proveedores externos que prestan servicios esenciales para el funcionamiento de UniBus, como hosting, análisis de datos y soporte técnico. Estos proveedores están obligados contractualmente a mantener la confidencialidad de tus datos.
                            </li>
                            <li>
                                <strong>Autoridades Legales:</strong> Divulgaremos información solo si es requerido por ley, regulación o proceso legal, o para proteger los derechos, propiedad o seguridad de UniBus, sus usuarios u otros terceros.
                            </li>
                            <li>
                                <strong>Fusiones o Adquisiciones:</strong> En caso de fusión, adquisición o venta de activos, tu información podría transferirse a los nuevos propietarios, quienes estarán sujetos a estas mismas políticas de privacidad.
                            </li>
                        </ul>
                    </section>

                    <section id="seguridad" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            4. Seguridad de la Información
                        </h2>
                        <p>
                            En UniBus, implementamos medidas de seguridad técnicas, administrativas y organizativas para proteger los datos personales contra accesos no autorizados, alteraciones, pérdidas o usos indebidos. Entre estas medidas se incluyen:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-justify">
                            <li>
                                <strong>Cifrado de Datos:</strong> Implementamos algoritmos de cifrado seguros para proteger información sensible como contraseñas y datos personales.
                            </li>
                            <li>
                                <strong>Control de Acceso:</strong> Mantenemos un sistema estricto de control de acceso a la información, limitando el acceso solo al personal autorizado y necesario.
                            </li>
                            <li>
                                <strong>Monitoreo Continuo:</strong> Realizamos monitoreo y auditorías regulares de nuestros sistemas de información para detectar y prevenir posibles vulnerabilidades.
                            </li>
                            <li>
                                <strong>Cumplimiento Normativo:</strong> Nos adherimos a las normativas locales e internacionales sobre protección de datos personales, garantizando el cumplimiento de los estándares de seguridad requeridos.
                            </li>
                        </ul>
                    </section>

                    <section id="derechos" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            5. Derechos del Usuario
                        </h2>
                        <p>
                            Como usuario de UniBus, tienes los siguientes derechos respecto a tus datos personales:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-justify">
                            <li>
                                <strong>Acceso:</strong> Puedes solicitar una copia de los datos personales que tenemos sobre ti.
                            </li>
                            <li>
                                <strong>Rectificación:</strong> Si encuentras errores en tus datos, puedes solicitar su corrección.
                            </li>
                            <li>
                                <strong>Eliminación:</strong> Puedes solicitar la eliminación de tus datos personales, siempre que no sean necesarios para cumplir con obligaciones legales o contractuales.
                            </li>
                            <li>
                                <strong>Oposición:</strong> Puedes oponerte al tratamiento de tus datos para fines específicos, como marketing directo.
                            </li>
                            <li>
                                <strong>Portabilidad:</strong> Puedes solicitar una copia de tus datos en un formato estructurado y comúnmente utilizado.
                            </li>
                        </ul>
                    </section>

                    <section id="cambios" className="mb-8 text-justify">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">
                            6. Cambios en las Políticas de Privacidad
                        </h2>
                        <p>
                            Nos reservamos el derecho de actualizar o modificar estas políticas de privacidad en cualquier momento. Si realizamos cambios significativos, te notificaremos a través de la plataforma o por correo electrónico antes de que entren en vigor. Te recomendamos revisar periódicamente este documento para estar informado/a sobre cómo protegemos tu información.
                        </p>
                    </section>

                    <section id="contacto" className="mb-8">
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                            Contacto
                        </h2>
                        <p>
                            Si tienes preguntas sobre estas politicas de privicades, por favor, contacte con nosotros:
                        </p>
                        <a href="mailto:unibus.support@gmail.com" className="text-blue-500 hover:underline">
                            unibus.support@gmail.com
                        </a>
                    </section>
                </main>
            </div>
        </HeaderFooter >

    )
}