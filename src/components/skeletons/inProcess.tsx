import React, { useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const InProcess: React.FC = memo(() => {
    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "tween" }
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0d35] to-[#2D5DA1] flex items-center justify-center z-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2B134]/10 rounded-full blur-3xl" />
            
            <motion.div
                className="relative z-10 max-w-3xl w-full mx-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                
                <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                        <img
                            src="/inprocess.gif"
                            alt="Under Construction"
                            className="w-64 h-64 object-contain rounded-full border-4 border-white/30 shadow-lg"
                            loading="lazy"
                        />
                    </div>

                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
                        variants={itemVariants}
                    >
                        <span className="text-[#F2B134]">Página</span> en Construcción
                    </motion.h1>

                    <motion.p
                        className="text-xl text-white/80 text-center mb-8 max-w-lg"
                        variants={itemVariants}
                    >
                        Estamos trabajando para ofrecerte una experiencia increíble. ¡Vuelve pronto!
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
                        variants={itemVariants}
                    >
                        <button
                            className="bg-[#F2B134] hover:bg-[#F2B134]/90 text-[#0a0d35] font-bold py-3 px-6 rounded-lg shadow-lg flex-1 flex items-center justify-center transition-all"
                            onClick={() => window.history.back()}
                        >
                            Regresar
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
});

export default InProcess;
