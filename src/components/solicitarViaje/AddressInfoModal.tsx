import React, { useEffect, useState } from 'react';

interface AddressInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddressInfoModal: React.FC<AddressInfoModalProps> = ({ isOpen, onClose }) => {
    const [animateIn, setAnimateIn] = useState(false);
    
    // Controlar la animación del modal
    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);
    
    // Prevenir scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            style={{
                perspective: '1000px'
            }}
        >
            <div 
                className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${animateIn ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 rotate-1'}`}
                onClick={e => e.stopPropagation()}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(45, 93, 161, 0.25)',
                }}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2D5DA1]/10 to-[#5AAA95]/10 rounded-bl-[100px] rounded-tr-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#2D5DA1]/10 to-[#5AAA95]/10 rounded-tr-[100px] rounded-bl-3xl -z-10"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(90,170,149,0.03)_0%,rgba(255,255,255,0)_70%)] rounded-full -z-10"></div>
                
                {/* Top decorative bar */}
                <div className="h-2 bg-gradient-to-r from-[#2D5DA1] via-[#5AAA95] to-[#2D5DA1] rounded-t-3xl"></div>
                
                {/* Close button with animation */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 flex items-center justify-center w-8 h-8 text-[#4A4E69]/60 hover:text-[#2D5DA1] focus:outline-none transition-all duration-300 transform hover:rotate-90 hover:scale-110 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg z-10"
                    aria-label="Cerrar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <div className="p-5 md:p-7">
                    {/* Header with icon and title */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#2D5DA1] to-[#5AAA95] text-white rounded-xl shadow-md transform -rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] m-0">¿Cómo escribir tu dirección en Colombia?</h2>
                            <p className="text-[#4A4E69]/70 mt-1 text-sm">Guía completa para ingresar correctamente tu ubicación</p>
                        </div>
                    </div>
                    
                    {/* Introduction with animated border */}
                    <div className="relative p-4 mb-6 overflow-hidden group">
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2D5DA1]/5 to-[#5AAA95]/5"></div>
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-[#2D5DA1] via-[#5AAA95] to-[#2D5DA1] rounded-xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="absolute inset-[1px] bg-white rounded-xl"></div>
                        </div>
                        <p className="relative text-[#4A4E69] italic text-sm">
                            Para que podamos encontrar tu ubicación exacta en el mapa y asegurarnos de que la información 
                            sea precisa, por favor ingresa tu dirección siguiendo el formato estándar colombiano. 
                            Nuestro sistema utiliza esta información para convertirla en coordenadas geográficas.
                        </p>
                    </div>
                    
                    {/* Formato Recomendado */}
                    <div className="bg-gradient-to-br from-[#F8F9FA] to-white rounded-xl p-4 shadow-md mb-6 border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="flex items-center text-lg font-bold text-[#2D5DA1] mt-0 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#2D5DA1] text-white rounded-lg mr-3 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            Formato Recomendado
                        </h3>
                        <p className="text-[#4A4E69] text-sm mb-3">
                            Por favor, escribe tu dirección completa en un solo campo de texto, siguiendo este patrón general:
                        </p>
                        <div className="relative overflow-hidden rounded-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] opacity-10"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm p-3 rounded-lg border-2 border-[#2D5DA1]/20">
                                <p className="font-semibold text-[#2D5DA1] text-center text-sm mb-0">
                                    [Tipo Vía Principal] [Número Vía Principal] # [Número Vía Intersectora] - [Número Distancia] [Complementos (Opcional)], [Ciudad], [Departamento]
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Explicación de las Partes */}
                    <div className="bg-white rounded-xl p-4 shadow-md mb-6 border border-gray-100">
                        <h3 className="flex items-center text-lg font-bold text-[#2D5DA1] mt-0 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#2D5DA1] text-white rounded-lg mr-3 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            Explicación de las Partes
                        </h3>
                        <ul className="list-none pl-0 space-y-3 text-[#4A4E69] text-sm">
                            {[
                                {
                                    title: "Tipo Vía Principal:",
                                    content: "Utiliza la abreviatura oficial del tipo de vía principal (donde está ubicada la dirección). Ejemplos: Cl (Calle), Kr (Carrera), Dg (Diagonal), Tr (Transversal), Av (Avenida), Av Cl (Avenida Calle), Av Kr (Avenida Carrera)."
                                },
                                {
                                    title: "Número Vía Principal:",
                                    content: "El número de la calle, carrera, diagonal, etc."
                                },
                                {
                                    title: "Número Vía Intersectora (#):",
                                    content: "El símbolo numeral # seguido del número de la vía que cruza o intersecta la vía principal."
                                },
                                {
                                    title: "Número Distancia (-):",
                                    content: "Un guion - seguido del número que indica la distancia desde la vía intersectora hasta el punto exacto."
                                },
                                {
                                    title: "Complementos (Opcional):",
                                    content: "Información adicional para especificar la ubicación dentro de una propiedad o conjunto. Separa estos elementos con espacios o comas. Ejemplos: Barrio [Nombre], Edificio [Nombre], Torre [Número/Letra], Apto [Número], Casa [Número], Interior [Número], Etapa [Número]."
                                },
                                {
                                    title: "Ciudad (usa ',' para separar):",
                                    content: "El nombre completo de la Ciudad o Municipio. Es fundamental incluir esto."
                                },
                                {
                                    title: "Departamento (usa ',' para separar):",
                                    content: "El nombre del Departamento. Aunque a veces opcional, es altamente recomendado para evitar ambigüedades, especialmente en ciudades o vías con nombres/números comunes."
                                }
                            ].map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#2D5DA1] to-[#5AAA95] text-white text-xs font-bold mr-3 mt-0.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 p-2 bg-[#F8F9FA] rounded-lg group-hover:bg-[#F8F9FA]/80 group-hover:shadow-sm transition-all duration-300">
                                        <strong className="text-[#2D5DA1] text-sm block mb-1">{item.title}</strong>
                                        <span className="text-xs">{item.content}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Ejemplos Prácticos */}
                    <div className="bg-gradient-to-br from-[#5AAA95]/10 to-white rounded-xl p-4 shadow-md mb-6 border border-[#5AAA95]/20 transform hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="flex items-center text-lg font-bold text-[#5AAA95] mt-0 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#5AAA95] text-white rounded-lg mr-3 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            Ejemplos Prácticos
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {[
                                "Cl 12 # 34 - 56, Bogotá, Cundinamarca",
                                "Kr 7 # 116 - 05 Edificio Las Américas Apto 301, Bogotá, Cundinamarca",
                                "Dg 60 # 45 - 20 Casa 3, Barrio La Soledad, Medellín, Antioquia",
                                "Tr 23 # 10 - 15 Interior 5, Cali, Valle del Cauca",
                                "Av Cl 26 # 68D - 35, Bogotá, Cundinamarca",
                                "Cl 85 # 10 - 15 Torre B Piso 5, Barranquilla, Atlántico"
                            ].map((example, index) => (
                                <div key={index} className="bg-white p-2 rounded-lg border border-[#5AAA95]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#5AAA95]/10 text-[#5AAA95] text-xs font-bold mr-2 flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="m-0 text-[#4A4E69] text-xs">{example}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Recomendaciones Clave */}
                    <div className="relative bg-white rounded-xl p-4 shadow-md mb-5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#2D5DA1] to-[#5AAA95]"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95]"></div>
                        
                        <h3 className="flex items-center text-lg font-bold text-[#2D5DA1] mt-0 mb-3 ml-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#2D5DA1] text-white rounded-lg mr-3 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            Recomendaciones Clave
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 ml-3">
                            {[
                                "Usa las abreviaturas oficiales (Cl, Kr, Dg, Tr, etc.).",
                                "Incluye siempre la Ciudad.",
                                "Incluye el Departamento si es posible para mayor precisión.",
                                "Sé lo más específico posible con los complementos.",
                                "Evita abreviaturas no estándar o información irrelevante.",
                                "Verifica que no haya errores de escritura."
                            ].map((tip, index) => (
                                <div key={index} className="bg-[#F8F9FA] p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 group">
                                    <div className="flex items-start">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#2D5DA1] to-[#5AAA95] text-white text-xs font-bold mr-1 mt-0.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            ✓
                                        </div>
                                        <p className="m-0 text-[#4A4E69] text-xs group-hover:text-[#2D5DA1] transition-colors duration-300">{tip}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Footer note with animated gradient text */}
                    <div className="text-center mt-5 mb-2">
                        <p className="text-[#4A4E69]/80 text-xs italic relative inline-block">
                            <span className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#2D5DA1]/30 to-transparent"></span>
                            Seguir estas recomendaciones ayudará a nuestro sistema a identificar y ubicar tu dirección de forma rápida y precisa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressInfoModal; 