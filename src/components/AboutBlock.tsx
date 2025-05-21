// "/Somil_profile.webp"

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AboutProps } from "../core/interfaces/AboutProps";


export function AboutBlock({ id,name, role, phrase, gitnetwork, linkedinetwork, image }: AboutProps) {
    return(
        <div className='flex flex-col-reverse md:flex-row justify-center items-center bg-[#e8e8e8] gap-4 p-6 shadow-lg rounded-lg w-full max-w-lg md:max-w-none'>
                                     {id%2!==0&&(<div>
                                        <img src={image} alt={`${name} picture`} className={`mr-0 ml-0 md:mr-${id===1?"4":50} md:ml-2 w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg border-4 border-[#2D5DA1] object-cover`} />
                                    </div>)}                                                
                                    <div>        
                                        <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                            <h3 className='text-center text-xl text-[#2D5DA1] my-6 font-bold'>Nombre: </h3>
                                            <p className='text-lg font-[Montserrat]'>{name}</p>
                                        </div>
                                        <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                            <h3 className='text-center text-xl text-[#2D5DA1] my-6 font-bold'>Cargo: </h3>
                                            <p className='text-lg font-[Montserrat]'> {role}</p>
                                        </div>
                                        <div className='flex justify-center ml-4 mt-4 md:ml-0 md:mt-0 md:justify-start items-center flex-wrap gap-2'>
                                            <p className='text-lg font-[Montserrat]'>{phrase}</p>
                                        </div>
                                        <div className='flex justify-center md:justify-start items-center flex-wrap gap-2'>
                                            <h3 className='text-center text-xl text-[#2D5DA1] my-6 font-bold'>Redes Sociales: </h3>
                                            <a
                                                href={gitnetwork}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-800 hover:text-gray-600 transition-all text-3xl"
                                            >
                                                <FaGithub />
                                            </a>
                                            <a
                                                href={linkedinetwork}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 hover:text-blue-500 transition-all text-3xl"
                                            >
                                                <FaLinkedin />
                                            </a>
                                        </div>
                                    </div>
                                    {id%2===0&&(<div>
                                        <img src={image} alt={`${name} picture`} className="mr-0 ml-0 md:mr-50 md:ml-2 w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg border-4 border-[#2D5DA1] object-cover" />
                                    </div>)}
                                </div>
    );
}