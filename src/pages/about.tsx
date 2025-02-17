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
    { id: "devs", title: "3. Equipo de desarrollo" },

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
                        UniBus
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
                    <h2 className='text-center text-5xl text-green-700 my-6'>Acerca de Nosotros</h2>
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