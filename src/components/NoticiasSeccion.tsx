import { useRef, useEffect } from "react"
import { NoticiasCard } from "./NoticiasCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Noticia {
    id: number
    title: string
    summary: string
    imageUrl: string
    readMoreLink: string
}

const noticias: Noticia[] = [
    {
        id: 1,
        title: "Aumento en tarifas de buses",
        summary: "A partir del próximo mes, las tarifas de buses aumentarán un 5% debido a...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        readMoreLink: "/noticias/aumento-tarifas",
    },
    {
        id: 2,
        title: "Desvío temporal en la ruta 34",
        summary: "Debido a obras en la Avenida Principal, la ruta 34 será desviada por...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        readMoreLink: "/noticias/desvio-ruta-34",
    },
    {
        id: 3,
        title: "Nueva ciclovía en el centro",
        summary: "Se ha inaugurado una nueva ciclovía en el centro para fomentar la movilidad sostenible...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        readMoreLink: "/noticias/ciclovia-centro",
    },
    {
        id: 4,
        title: "Reducción en el tráfico por teletrabajo",
        summary: "El tráfico en la ciudad ha disminuido un 20% gracias a la adopción del teletrabajo...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        readMoreLink: "/noticias/trafico-teletrabajo",
    },
]

export function NoticiasSection() {
    const carouselRef = useRef<HTMLDivElement>(null)
    let scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        const carousel = carouselRef.current
        if (!carousel) return


        const startScrolling = () => {
            if (scrollInterval.current) return // Evita duplicar intervalos

            scrollInterval.current = setInterval(() => {
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
                    carousel.scrollLeft = 0
                } else {
                    carousel.scrollLeft += 1
                }
            }, 30)
        }

        const stopScrolling = () => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current)
                scrollInterval.current = null
            }
        }
        startScrolling()

        carousel.addEventListener("mouseenter", stopScrolling)
        carousel.addEventListener("mouseleave", startScrolling)

        return () => {
            stopScrolling()
            carousel.removeEventListener("mouseenter", stopScrolling)
            carousel.removeEventListener("mouseleave", startScrolling)
        }
    }, [])

    const scroll = (direction: "left" | "right") => {
        const carousel = carouselRef.current
        if (carousel) {
            const scrollAmount = direction === "left" ? -300 : 300
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    return (
        <section className="py-12 px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Noticias Relevantes</h2>
            <div className="relative w-full overflow-hidden">
                <div ref={carouselRef} className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                    >
                        {noticias.map((noticia) => (
                            <div key={noticia.id} className="flex-shrink-0 w-[300px]">
                                <NoticiasCard {...noticia} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón Izquierdo */}
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2  bg-transparent border-2 border-gray-500 p-2 rounded-full hover:bg-gray-200"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                {/* Botón Derecho */}
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent border-2 border-gray-500 p-2 rounded-full hover:bg-gray-200"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
            </div>
        </section>
    )
}
