import React from 'react';
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa";
import HeaderFooter from '../layouts/headerFooter';
import Julian from '../assets/JulianColl_about.png';

const sections = [
    { id: "intro", title: "Introducción" },
    { id: "mision", title: "1. Mision" },
    { id: "vision", title: "2. Vision" },
    { id: "devs", title: "3. Acerca de nosotros" },

];

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
            <div className="bg-white text-gray-800 min-h-screen scroll-pt-48">
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
                <main id="intro" className="ml-0 md:ml-64 p-8 max-w-6xl">
                    <h1 className="text-4xl font-bold text-red-600 mb-6">
                        UniBus: Transformando la Movilidad en Barranquilla
                    </h1>
                    <nav className="mb-8">
                        <ol className="flex items-center text-sm">
                            <li>
                                <Link to="/" className="text-blue-500 hover:underline">
                                    Página de inicio
                                </Link>
                            </li>
                            <ChevronRight className="mx-2 w-4 h-4 text-gray-600" />
                            <li className="text-gray-600">Acerca del proyecto</li>
                        </ol>
                    </nav>

                    <section className="mb-8 text-justify">
                        <p className="mb-4 text-[#333333] leading-relaxed">
                            En el corazón de Barranquilla, donde los desafíos del transporte público resuenan en el día a día de sus ciudadanos, nace <span className="font-semibold text-[#078930]">UniBus</span>, un proyecto innovador que busca transformar la movilidad. Diseñado y desarrollado por <span className="text-[#CF251F] font-medium">Somil Sandoval Díaz, Julián Coll y Julián Amario</span>, estudiantes de Ingeniería de Sistemas y Computación en la Universidad del Norte, UniBus no es solo una plataforma, es la respuesta a la necesidad de un sistema de transporte público eficiente, confiable y adaptado a las dinámicas de la ciudad.
                        </p>

                        <div className="my-6 p-4 bg-[#F5F5F5] rounded-md border-l-4 border-[#FCD116]">
                            <p className="text-[#333333] italic">
                                "Inspirados en nuestra propia experiencia como usuarios del transporte público, hemos observado las deficiencias del sistema actual y hemos decidido tomar acción."
                            </p>
                        </div>

                        <p className="text-[#333333] leading-relaxed">
                            UniBus comienza su camino enfocándose en las rutas universitarias, pero tiene la visión de extenderse a todas las rutas de Barranquilla, mejorando la calidad de vida de todos los ciudadanos.
                        </p>

                            <h2 className="text-3xl font-bold text-[#CF251F] mb-8 mt-8">Nuestra Misión y Visión</h2>

                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold text-[#078930] mb-4 flex items-center">
                                    <span className="bg-[#078930] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                                    Misión
                                </h3>
                                <p className="text-[#333333] leading-relaxed bg-[#F5F5F5] p-6 rounded-lg border-l-4 border-[#078930]">
                                    Nuestra misión es <span className="font-semibold text-[#CF251F]">revolucionar el transporte público en Barranquilla</span>, comenzando por las rutas universitarias. A través de una plataforma tecnológica intuitiva y un sistema de gestión dinámico de flotas, buscamos conectar a estudiantes, docentes y a todos los ciudadanos con un servicio de transporte optimizado, que reduzca los tiempos de espera, mejore la experiencia de viaje y contribuya a una movilidad urbana más sostenible.
                                </p>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold text-[#078930] mb-4 flex items-center">
                                    <span className="bg-[#078930] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                                    Visión
                                </h3>
                                <div className="text-[#333333] leading-relaxed bg-[#F5F5F5] p-6 rounded-lg border-l-4 border-[#FCD116]">
                                    <p className="mb-4">
                                        Nuestra visión es <span className="font-semibold text-[#CF251F]">convertirnos en el referente en gestión de transporte público en Barranquilla</span>, expandiendo nuestro servicio desde el ámbito universitario a todas las rutas de la ciudad. Queremos que UniBus sea sinónimo de eficiencia, confiabilidad y comodidad para todos los barranquilleros, y un modelo a seguir para otras ciudades que buscan transformar su sistema de transporte público.
                                    </p>
                                    <p className="mb-4">
                                        Aspiramos a un futuro donde el transporte público sea una experiencia positiva y accesible para todos, donde los tiempos de espera se reduzcan, la movilidad sea más fluida y la comunidad se conecte de manera eficiente con sus destinos.
                                    </p>
                                    <p>
                                        UniBus es más que un proyecto, es un <span className="font-semibold text-[#078930]">compromiso</span> con la mejora de la calidad de vida de los barranquilleros y con la construcción de una Barranquilla más moderna y sostenible.
                                    </p>
                                </div>
                            </div>
                    </section>



                    <h2 className='text-center text-3xl font-bold mb-8 mt-8 text-green-700'>Acerca de Nosotros</h2>
                    <div className="w-1/4 h-1 bg-green-700 mx-auto mb-4"></div>
                    <section className='flex justify-center items-center flex-wrap gap-4 mb-4'>
                        {/* Div de la siguiente persona */}
                        <div className='flex flex-col md:flex-row justify-center items-center bg-[#e8e8e8] p-6 shadow-lg rounded-lg w-full max-w-lg md:max-w-none'>
                            <div>
                                <img src={Julian} alt="Merged Fleets" className="mr-0 ml-0 md:mr-2 md:ml-2 max-w-[150px] md:max-w-sm rounded-full shadow-lg border-3 border-green-700" />
                            </div>
                            <div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Nombre: </h3>
                                    <p className='text-lg font-[Montserrat]'> Julian Andrés Coll Barros</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Cargo: </h3>
                                    <p className='text-lg font-[Montserrat]'> Desarrollador Front-End</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <p className='text-lg font-[Montserrat]'> "No siempre tengo un plan... pero cuando lo tengo, es increíble. Y cuando no, improviso con estilo."</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Redes Sociales: </h3>
                                    <a
                                        href="https://github.com/jcoll05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:text-gray-600 transition-all text-3xl"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/julian-coll-518647324/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:text-blue-500 transition-all text-3xl"
                                    >
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Div de la siguiente persona */}

                        <div className='flex flex-col-reverse md:flex-row justify-center items-center bg-[#e8e8e8] p-6 shadow-lg rounded-lg w-full max-w-lg md:max-w-none'>
                            <div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Nombre: </h3>
                                    <p className='text-lg font-[Montserrat]'> Julian Andrés Coll Barros</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Cargo: </h3>
                                    <p className='text-lg font-[Montserrat]'> Desarrollador Front-End</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <p className='text-lg font-[Montserrat]'> "No siempre tengo un plan... pero cuando lo tengo, es increíble. Y cuando no, improviso con estilo."</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Redes Sociales: </h3>
                                    <a
                                        href="https://github.com/jcoll05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:text-gray-600 transition-all text-3xl"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/julian-coll-518647324/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:text-blue-500 transition-all text-3xl"
                                    >
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                            <div>
                                <img src={Julian} alt="Merged Fleets" className="mr-0 ml-0 md:mr-2 md:ml-2 max-w-[150px] md:max-w-sm rounded-full shadow-lg border-3 border-green-700" />
                            </div>
                        </div>

                        {/* Div de la siguiente persona */}

                        <div className='flex flex-col md:flex-row justify-center items-center bg-[#e8e8e8] p-6 shadow-lg rounded-lg w-full max-w-lg md:max-w-none'>
                            <div>
                                <img src={Julian} alt="Merged Fleets" className="mr-0 ml-0 md:mr-2 md:ml-2 max-w-[150px] md:max-w-sm rounded-full shadow-lg border-3 border-green-700" />
                            </div>
                            <div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Nombre: </h3>
                                    <p className='text-lg font-[Montserrat]'> Julian Andrés Coll Barros</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Cargo: </h3>
                                    <p className='text-lg font-[Montserrat]'> Desarrollador Front-End</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <p className='text-lg font-[Montserrat]'> "No siempre tengo un plan... pero cuando lo tengo, es increíble. Y cuando no, improviso con estilo."</p>
                                </div>
                                <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                    <h3 className='text-center text-xl text-green-700 my-6 font-bold'>Redes Sociales: </h3>
                                    <a
                                        href="https://github.com/jcoll05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:text-gray-600 transition-all text-3xl"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/julian-coll-518647324/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:text-blue-500 transition-all text-3xl"
                                    >
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </HeaderFooter>
    );
};

export default About;