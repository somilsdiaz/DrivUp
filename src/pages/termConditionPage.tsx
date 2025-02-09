import React from 'react';
import HeaderFooter from '../layouts/headerFooter';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TermSection from '../components/TermsSection';

const termsAndConditions = [
    {
        title: "1. Acuerdos Legales",
        description: "Al registrarte en nuestra plataforma, aceptas los siguientes términos:",
        contentList: [
            "Cumplir con las normas establecidas en la plataforma.",
            "Proporcionar información veraz y actualizada en tu perfil de usuario.",
            "Usar el sistema de transporte universitario de manera responsable y respetuosa."
        ]
    },
    {
        title: "2. Responsabilidades del Usuario y de la Plataforma",
        contentList: [
            "Respetar las rutas y horarios establecidos por la plataforma.",
            "No utilizar la plataforma para fines distintos a la optimización del transporte universitario.",
            "Reportar cualquier incidencia o irregularidad detectada en el servicio.",
        ]
    },
    {
        title: "3. Responsabilidades de la Plataforma",
        contentList: [
            "Garantizar el correcto funcionamiento del sistema de gestión de transporte.",
            "Proteger la información personal de los usuarios conforme a la normativa vigente.",
            "Mejorar continuamente la distribución de la flota de autobuses para una mejor experiencia de movilidad."
        ]
    },
    {
        title: "4. Condiciones de Uso de los Servicios",
        description: "La plataforma está diseñada exclusivamente para la comunidad universitaria de Barranquilla.",
        contentList: [
            "El acceso y uso del servicio pueden estar sujetos a verificaciones de identidad.",
            "La plataforma podrá modificar rutas y horarios en función de la demanda detectada."
        ]
    },
    {
        title: "5. Políticas sobre Creación de Cuentas y Manejo de Datos",
        description: "La información proporcionada por los usuarios será utilizada únicamente para la optimización del servicio de transporte. Los datos recopilados incluyen:",
        contentList: [
            "Nombre y apellidos.",
            "Número de identificación y tipo de documento.",
            "Fecha de nacimiento.",
            "Universidad y ciudad de residencia.",
            "Correo electrónico y contraseña.",
            "Historial de uso del servicio para mejorar la asignación de rutas."
        ]
    },
    {
        title: "6. Consecuencias del Incumplimiento",
        description: "El incumplimiento de los presentes términos y condiciones podrá conllevar las siguientes acciones:",
        contentList: [
            "Suspensión o eliminación de la cuenta del usuario.",
            "Restricción del acceso a la plataforma.",
            "Acciones legales en caso de uso indebido o fraude."
        ]
    }
];

const sections = [
    { id: "intro", title: "Introducción" },
    ...termsAndConditions.map((term) => ({
        id: `${term.title}`,
        title: `${term.title}`
    }))
];

const TermCondition: React.FC = () => {
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
                        Terminos y Condiciones de UniBus
                    </h1>

                    <nav className="mb-8">
                        <ol className="flex items-center text-sm">
                            <li>
                                <Link to="/" className="text-blue-500 hover:underline">
                                    Página de inicio
                                </Link>
                            </li>
                            <ChevronRight className="mx-2 w-4 h-4 text-gray-600" />
                            <li className="text-gray-600">Terminos y condiciones</li>
                        </ol>
                    </nav>

                    <section className="mb-8 text-justify">
                        <p>
                        Bienvenido a nuestra plataforma de optimización del sistema de transporte público universitario en la ciudad de Barranquilla. Antes de utilizar nuestros servicios, es importante que leas y comprendas los siguientes términos y condiciones. Al registrarte y usar la plataforma, aceptas cumplir con estas normas.
                        </p>

                    </section>

                    {termsAndConditions.map((term, index) => (
                        <TermSection key={index} title={term.title} description={term.description} contentList={term.contentList} />
                    ))}
                </main>
            </div>
        </HeaderFooter>
    );
};

export default TermCondition;
