import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

const Bienvenida: React.FC = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
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
            <div className="relative z-20 flex items-center h-full container mx-auto px-4 md:px-8">
                <div className="max-w-3xl">
                    {/* Eyebrow text */}
                    <p className="text-[#F2B134] font-medium tracking-wide mb-4 animate-fadeIn">
                        LA FORMA INTELIGENTE DE VIAJAR
                    </p>
                    
                    {/* Main Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slideUp">
                        Transforma tu manera de <span className="text-[#F2B134]">moverte</span> por la ciudad
                    </h1>
                    
                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-6 animate-slideUp animation-delay-200">
                        Viajes compartidos que conectan personas, ahorran tiempo y protegen nuestro entorno
                    </h2>
                    
                    {/* Description */}
                    <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl animate-slideUp animation-delay-400">
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
                    
                    {/* Trust Indicators */}
                    <div className="mt-12 pt-8 border-t border-white/20 flex items-center flex-wrap gap-6 animate-fadeIn animation-delay-800">
                        <p className="text-white/70 text-sm font-medium">Descarga la app:</p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-black/80 hover:bg-black text-white rounded-md px-4 py-2 flex items-center transition-colors">
                                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.5236 12.5192C17.5236 9.98845 19.5955 8.93823 19.6893 8.88409C18.5589 7.22724 16.8412 6.95749 16.2197 6.93267C14.765 6.78025 13.3567 7.79129 12.6134 7.79129C11.8524 7.79129 10.6844 6.95749 9.45654 6.9823C7.91189 7.00712 6.4674 7.86575 5.67129 9.21699C4.03926 11.9692 5.26201 16.0547 6.82149 18.5482C7.60778 19.7715 8.5272 21.1351 9.73013 21.0859C10.9083 21.0318 11.3562 20.3377 12.7769 20.3377C14.1803 20.3377 14.6035 21.0859 15.8311 21.0539C17.0959 21.0318 17.8822 19.8332 18.6413 18.5976C19.5333 17.1776 19.9041 15.7872 19.9289 15.7108C19.8969 15.6991 17.5285 14.7645 17.5236 12.5192Z"/>
                                    <path d="M15.3089 5.15379C15.9428 4.35767 16.3632 3.27808 16.2197 2.18848C15.2782 2.23281 14.1283 2.82411 13.4697 3.59541C12.8854 4.27471 12.376 5.40024 12.5443 6.44064C13.6005 6.52925 14.6502 5.93795 15.3089 5.15379Z"/>
                                </svg>
                                App Store
                            </a>
                            <a href="#" className="bg-black/80 hover:bg-black text-white rounded-md px-4 py-2 flex items-center transition-colors">
                                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.60468 2.95468C3.37964 3.18036 3.23907 3.53956 3.23907 4.02841V19.9716C3.23907 20.4604 3.37964 20.8196 3.60468 21.0453L3.67551 21.1124L13.3452 11.5V11.5L3.67551 1.88761L3.60468 2.95468Z"/>
                                    <path d="M17.5716 15.6837L13.3452 11.5V11.5L17.5716 7.31629L17.6613 7.36696L22.6347 10.1629C24.1211 11.0067 24.1211 12.4933 22.6347 13.3371L17.6613 16.133L17.5716 15.6837Z"/>
                                    <path d="M17.6612 16.133L13.3451 11.5L3.60461 21.0453C4.14362 21.6078 5.03546 21.6781 6.0524 21.1453L17.6612 16.133"/>
                                    <path d="M17.6612 6.86696L6.0524 1.85464C5.03546 1.32189 4.14362 1.39225 3.60461 1.95469L13.3451 11.5L17.6612 6.86696Z"/>
                                </svg>
                                Google Play
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="hidden lg:block absolute right-10 bottom-20 z-20">
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
            <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 animate-bounce">
                <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scrollDown"></div>
                </div>
            </div>
        </div>
    );
};

export default Bienvenida;

/* Add these styles to your global CSS file for the animations */
/* 
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scrollDown {
  0% { transform: translateY(0); opacity: 0; }
  50% { transform: translateY(8px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}

.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}

.animate-slideUp {
  animation: slideUp 0.8s ease forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

.animate-scrollDown {
  animation: scrollDown 2s infinite;
}
*/