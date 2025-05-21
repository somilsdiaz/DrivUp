import React from 'react';
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"
import HeaderFooter from '../layouts/headerFooter';
import Julian from '../assets/JulianColl_about.png';
import JulianAlmario from '../assets/Julian Almario Photo.jpeg';
import { AboutProps } from '../core/interfaces/AboutProps';
import { AboutBlock } from '../components/AboutBlock';

const sections = [
    { id: "intro", title: "Introducción" },
    { id: "mision", title: "1. Mision" },
    { id: "vision", title: "2. Vision" },
    { id: "devs", title: "3. Acerca de nosotros" },

];


const aboutArray:AboutProps[]=[{id:1,name: "Julian Andrés Coll Barros", role: "Desarrollador Front-End", 
    phrase: "No siempre tengo un plan... pero cuando lo tengo, es increíble. Y cuando no, improviso con estilo.", 
    gitnetwork: "https://github.com/jcoll05", linkedinetwork: "https://www.linkedin.com/in/julian-coll-518647324/",
     image: Julian},
    {id:2,name: "Somil Sandoval Diaz", role: "Desarrollador Full-Stack",
    phrase: "La habilidad técnica es fundamental para resolver problemas, pero es la pasión por lo que haces, junto con la disciplina y el compromiso con la excelencia lo que te lleva a transformar una buena solución en algo verdaderamente extraordinario.",
    gitnetwork:"https://github.com/somilsdiaz", linkedinetwork:"https://www.linkedin.com/in/somil-sandoval-diaz/", 
    image:"/Somil_profile.webp"},
    {id:3,name: "Julian Almario", role: "Desarrollador Full-Stack",
    phrase:"Creo en la resiliencia como motor del aprendizaje y en la constancia como clave para transformar ideas en realidades. Cada desafío es una oportunidad para crecer, mejorar y encontrar soluciones innovadoras.",
    gitnetwork:"https://github.com/JulianAlmario",linkedinetwork:"https://www.linkedin.com/in/julian-david-almario-vergara-0b0b63321/",
    image:JulianAlmario}];

const About: React.FC = () => {

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
            <div className="bg-[#F8F9FA] text-[#4A4E69] min-h-screen scroll-pt-48">
                <nav
                    className={`bg-white w-64 absolute top-20 left-0 p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out hidden md:block`}
                >
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={(e) => handleScrollToSection(e, section.id)}
                            className="block py-2 text-[#4A4E69] hover:text-[#2D5DA1]"
                        >
                            {section.title}
                        </a>
                    ))}
                </nav>
                <main id="intro" className="ml-0 md:ml-64 p-8 max-w-6xl">
                    <h1 className="text-4xl font-bold text-[#2D5DA1] mb-6">
                        DrivUp: Movilidad Colectiva Reimaginada
                    </h1>
                    <nav className="mb-8">
                        <ol className="flex items-center text-sm">
                            <li>
                                <Link to="/" className="text-[#2D5DA1] hover:underline">
                                    Página de inicio
                                </Link>
                            </li>
                            <ChevronRight className="mx-2 w-4 h-4 text-[#4A4E69]/60" />
                            <li className="text-[#4A4E69]/60">Acerca del proyecto</li>
                        </ol>
                    </nav>

                    <section className="mb-8 text-justify">
                        <p className="mb-4 text-[#333333] leading-relaxed">
                            En un contexto donde las soluciones de transporte tradicionales no siempre logran equilibrar costo, comodidad y eficiencia, nace <span className="font-semibold text-[#5AAA95]">DrivUp</span>, una proyecto diseñado para revolucionar la forma en que las personas se desplazan en sus ciudades. Este proyecto desarrollado por <span className="text-[#FF6B6B] font-medium">Somil Sandoval Díaz, Julián Coll y Julián Amario</span>, estudiantes de Ingeniería de Sistemas y Computación en la Universidad del Norte, DrivUp no busca simplemente emparejar un conductor con un pasajero, sino maximizar la ocupación de cada vehículo agrupando múltiples pasajeros que comparten trayectos similares. Esta optimización se logra a través del uso estratégico de Puntos de Mayor Concentración de Personas (PMCPs), que permiten estructurar mejor la oferta y demanda de viajes en zonas clave de la ciudad.
                        </p>

                        <div className="my-6 p-4 bg-[#F8F9FA] rounded-md border-l-4 border-[#5AAA95]">
                            <p className="italic">
                                "Inspirados en nuestra propia experiencia como usuarios del transporte público y privado, hemos observado las deficiencias del sistema actual y hemos decidido tomar acción."
                            </p>
                        </div>

                        <p className="leading-relaxed">
                            DrivUp es una solución concreta para quienes buscan una alternativa a medio camino entre el transporte público (económico pero inflexible) y los servicios privados (convenientes pero costosos). Con un enfoque centrado en la eficiencia colectiva, DrivUp permite coordinar viajes, gestionar solicitudes, visualizar rutas en mapas reales y medir indicadores clave como la ocupación vehicular.
                        </p>

                        <h2 className="text-3xl font-bold text-[#2D5DA1] mb-8 mt-8">Nuestra Misión y Visión</h2>

                        <div id="mision" className="mb-10 ">
                            <h3 className="text-2xl font-semibold text-[#5AAA95] mb-4 flex items-center">
                                <span className="bg-[#5AAA95] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                                Misión
                            </h3>
                            <p className="leading-relaxed bg-[#F5F5F5] p-6 rounded-lg border-l-4 border-[#5AAA95]">
                                Nuestra misión es <span className="font-semibold text-[#FF6B6B]">ofrecer una plataforma tecnológica que conecte a conductores formalizados con pasajeros interesados en compartir trayectos</span>, optimizando así el uso de cada vehículo. A través de la agrupación inteligente de solicitudes y el uso de Puntos de Mayor Concentración de Personas (PMCPs), buscamos mejorar el acceso a soluciones de movilidad flexibles, económicas y sostenibles para todos.
                            </p>
                        </div>

                        <div id="vision" className="mb-10">
                            <h3 className="text-2xl font-semibold text-[#5AAA95] mb-4 flex items-center">
                                <span className="bg-[#5AAA95] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                                Visión
                            </h3>
                            <div className="leading-relaxed bg-[#F5F5F5] p-6 rounded-lg border-l-4 border-[#5AAA95]">
                                <p className="mb-4">
                                    Nuestra visión es <span className="font-semibold text-[#FF6B6B]">consolidarnos como un referente en soluciones de movilidad compartida</span>, brindando una experiencia de transporte más eficiente, colaborativa y amigable con el entorno. Aspiramos a que DrivUp se convierta en una alternativa viable al transporte individual, promoviendo una movilidad urbana más inteligente, accesible y conectada.


                                </p>
                                <p className="mb-4">
                                    Aspiramos a un futuro donde la movilidad colectiva sea una opción atractiva, eficiente y accesible para todos. Imaginamos ciudades en las que las personas puedan compartir trayectos sin complicaciones, reduciendo significativamente los costos individuales y el número de vehículos necesarios para transportar a la misma cantidad de personas.
                                </p>
                                <p>
                                    DrivUp es más que un proyecto, es un <span className="font-semibold text-[#5AAA95]">compromiso</span> con la mejora de la calidad de vida y con la construcción de ciudades más modernas y sostenibles.
                                </p>
                            </div>
                        </div>
                    </section>


                    <h2 id="devs" className='text-center text-3xl font-bold mb-8 mt-8 text-[#2D5DA1]'>Acerca de Nosotros</h2>
                    <div className="w-1/4 h-1 bg-[#2D5DA1] mx-auto mb-4"></div>
                    <section className='flex justify-center items-center flex-wrap gap-4 mb-4'>
                        {aboutArray.map((about, index) => (
                          <AboutBlock key={index} {...about}/>
                        ))}
                    </section>
                </main>
            </div>
        </HeaderFooter>
    );
};

export default About;