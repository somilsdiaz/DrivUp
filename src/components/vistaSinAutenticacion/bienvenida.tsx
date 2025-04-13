import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

const Bienvenida: React.FC = () => {
    return (
        <div className="relative w-full h-[auto] p-2 pb-5 overflow-hidden min-[1325px]:h-screen items-center ">
            {/* Background Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/background.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D5DA1]/90 via-[#2D5DA1]/75 to-[#2D5DA1]/60 z-10"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex h-auto container mx-auto px-4 md:px-8 ">
                <div className="max-w-3xl mt-14">
                    {/* Eyebrow text */}
                    <p className="text-[#F2B134] font-medium tracking-wide mb-4 md:mb-3 lg:mb-2 animate-fadeIn">
                        LA FORMA INTELIGENTE DE VIAJAR
                    </p>
                    
                    {/* Main Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 animate-slideUp">
                        Transforma tu manera de <span className="text-[#F2B134]">moverte</span> por la ciudad
                    </h1>
                    
                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-6 md:mb-5 lg:mb-4 animate-slideUp animation-delay-200">
                        Viajes compartidos que conectan personas, ahorran tiempo y protegen nuestro entorno
                    </h2>
                    
                    {/* Description */}
                    <p className="text-base md:text-lg text-white/80 mb-8 md:mb-6 lg:mb-5 max-w-2xl animate-slideUp animation-delay-400">
                        DrivUP combina tecnología inteligente y el poder de la comunidad para ofrecerte 
                        una alternativa de transporte más económica, eficiente y sostenible. Olvídate del 
                        tráfico, los largos tiempos de espera y la contaminación.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-slideUp animation-delay-600">
                        <Link 
                            to="/register" 
                            className="bg-[#F2B134] hover:bg-[#F2B134]/90 text-[#4A4E69] font-bold py-3 px-6 rounded-md shadow-lg flex items-center justify-center sm:justify-start transition-all transform hover:scale-105 group"
                        >
                            Regístrate ya
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link 
                            to="/how-it-works" 
                            className="border-2 border-white/70 hover:border-white text-white hover:bg-white/10 py-3 px-6 rounded-md flex items-center justify-center sm:justify-start transition-all"
                        >
                            Cómo funciona
                            <ChevronRight className="ml-1 h-5 w-5" />
                        </Link>
                    </div>
                    
                 
                    
                </div>
                
                {/* Decorative Elements */}
                <div className="hidden lg:block absolute right-10 top-5 z-20">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-xs">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#F2B134] h-10 w-10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4A4E69]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold">Viajes seguros</p>
                                <p className="text-white/70 text-sm">Conductores verificados</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#5AAA95] h-10 w-10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold">Ahorra dinero</p>
                                <p className="text-white/70 text-sm">Hasta 50% menos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Animated Scroll Indicator */}
            <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 animate-bounce hidden md:flex">
                <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scrollDown"></div>
                </div>
            </div>
        </div>
    );
};

export default Bienvenida;