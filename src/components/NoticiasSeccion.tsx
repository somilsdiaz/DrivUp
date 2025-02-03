import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NoticiasCard } from "./NoticiasCard"

interface Noticia {
    id: number
    title: string
    summary: string
    imageurl: string
    date: string
    readtime: number
    empresa: string
}

export function NoticiasSection() {
    const carouselRef = useRef<HTMLDivElement>(null)
    let scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null)


    const [noticias, setNoticias] = useState<Noticia[]>([]);

    useEffect(() => {
        // Función para obtener las noticias desde el backend
        const fetchNoticias = async () => {
            try {
                const response = await fetch("https://unibus-backend.onrender.com/noticias", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las noticias");
                }

                const data = await response.json();
                setNoticias(data);
            } catch (error) {
                console.error("Error fetching noticias:", error);
            }
        };

        fetchNoticias();
    }, []);


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
        <section className="py-3 px-4">
            <div className="relative w-full overflow-hidden">
                <div ref={carouselRef} className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out justify-center gap-4"
                    >
                        {noticias.map((noticia) => (
                            <div key={noticia.id} className="flex-shrink-0 w-[300px] gap-4">
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
