import type React from "react"
import { useEffect, useState } from "react"

type ModalType = "success" | "error" | "info"

interface ModalMessageProps {
    isOpen: boolean
    onClose: () => void
    message: string
    type: ModalType
    autoClose?: boolean
    autoCloseTime?: number
    showCancelButton?: boolean
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
}

const ModalMessage: React.FC<ModalMessageProps> = ({
    isOpen,
    onClose,
    message,
    type,
    autoClose = true,
    autoCloseTime = 3000,
    showCancelButton = false,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
}) => {
    const [progress, setProgress] = useState(100)
    const [isVisible, setIsVisible] = useState(false)
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setProgress(100)

            if (type === "success") {
                const newParticles = Array.from({ length: 12 }, (_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    delay: Math.random() * 0.5,
                }))
                setParticles(newParticles)
            }
        } else {
            setIsVisible(false)
            setParticles([])
        }
    }, [isOpen])

    useEffect(() => {
        let timer: NodeJS.Timeout
        let progressTimer: NodeJS.Timeout

        if (isOpen && autoClose) {
            const startTime = Date.now()

            const updateProgress = () => {
                const elapsed = Date.now() - startTime
                const remaining = Math.max(0, autoCloseTime - elapsed)
                const progressValue = (remaining / autoCloseTime) * 100
                setProgress(progressValue)

                if (remaining > 0) {
                    progressTimer = setTimeout(updateProgress, 16) // ~60fps
                }
            }

            updateProgress()

            timer = setTimeout(() => {
                setIsVisible(false)
                setTimeout(onClose, 300) 
            }, autoCloseTime)
        }

        return () => {
            if (timer) clearTimeout(timer)
            if (progressTimer) clearTimeout(progressTimer)
        }
    }, [isOpen, onClose, autoClose, autoCloseTime])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300) 
    }

    if (!isOpen) return null

    const getModalStyles = () => {
        switch (type) {
            case "success":
                return {
                    icon: (
                        <div className="relative">
                            <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg transform transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
                            >
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-ping opacity-20"></div>
                        </div>
                    ),
                    gradient: "from-emerald-50 to-green-50",
                    borderGradient: "from-emerald-200 to-green-200",
                    accentColor: "emerald",
                    progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-600",
                }
            case "error":
                return {
                    icon: (
                        <div className="relative">
                            <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg transform transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
                            >
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 animate-pulse opacity-20"></div>
                        </div>
                    ),
                    gradient: "from-red-50 to-rose-50",
                    borderGradient: "from-red-200 to-rose-200",
                    accentColor: "red",
                    progressColor: "bg-gradient-to-r from-red-400 to-red-600",
                }
            case "info":
            default:
                return {
                    icon: (
                        <div className="relative">
                            <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg transform transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
                            >
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse opacity-20"></div>
                        </div>
                    ),
                    gradient: "from-blue-50 to-indigo-50",
                    borderGradient: "from-blue-200 to-indigo-200",
                    accentColor: "blue",
                    progressColor: "bg-gradient-to-r from-blue-400 to-blue-600",
                }
        }
    }

    const { icon, gradient, borderGradient, accentColor, progressColor } = getModalStyles()

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
                className={`absolute inset-0 backdrop-blur-md transition-all duration-300 ${isVisible ? "bg-black/20" : "bg-black/0"
                    }`}
                onClick={showCancelButton && onCancel ? onCancel : handleClose}
            />

            {type === "success" &&
                particles.map((particle) => (
                    <div
                        key={particle.id}
                        className={`absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce opacity-60 transition-all duration-1000 ${isVisible ? "scale-100" : "scale-0"
                            }`}
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: "2s",
                        }}
                    />
                ))}

            <div
                className={`relative max-w-md w-full transform transition-all duration-500 ease-out ${isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
                    }`}
            >
                {autoClose && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden z-10">
                        <div
                            className={`h-full ${progressColor} transition-all duration-75 ease-linear`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div
                    className={`bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden`}
                >
                    <div className={`h-1 bg-gradient-to-r ${borderGradient}`} />

                    <div className="p-8">
                        <div className="flex justify-center mb-6">{icon}</div>

                        <div className="text-center space-y-4">
                            <h3
                                className={`text-2xl font-bold bg-gradient-to-r ${accentColor === "emerald"
                                        ? "from-emerald-600 to-green-600"
                                        : accentColor === "red"
                                            ? "from-red-600 to-rose-600"
                                            : "from-blue-600 to-indigo-600"
                                    } bg-clip-text text-transparent`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </h3>

                            <p className="text-gray-700 text-lg leading-relaxed font-medium">{message}</p>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            {showCancelButton && onCancel && (
                                <button
                                    type="button"
                                    className={`group relative px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-95`}
                                    onClick={onCancel}
                                >
                                    <span className="relative z-10">{cancelText}</span>
                                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </button>
                            )}
                            
                            <button
                                type="button"
                                className={`group relative px-8 py-3 bg-gradient-to-r ${accentColor === "emerald"
                                        ? "from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                                        : accentColor === "red"
                                            ? "from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                                            : "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    } text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-${accentColor}-200 active:scale-95`}
                                onClick={handleClose}
                            >
                                <span className="relative z-10">{confirmText}</span>
                                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${accentColor === "emerald"
                            ? "from-emerald-400/20 to-green-400/20"
                            : accentColor === "red"
                                ? "from-red-400/20 to-rose-400/20"
                                : "from-blue-400/20 to-indigo-400/20"
                        } blur-xl -z-10 transform transition-all duration-500 ${isVisible ? "scale-110 opacity-100" : "scale-100 opacity-0"
                        }`}
                />
            </div>
        </div>
    )
}

export default ModalMessage
