import { Calendar, Clock } from "lucide-react"

interface NoticiasCardProps {
    title: string;
    summary: string;
    imageUrl: string;
    readMoreLink: string;
    date: string; 
    readTime: number;
}

export function NoticiasCard({ title, summary, imageUrl, readMoreLink, date, readTime }: NoticiasCardProps) {
    return (
        <div className="w-[300px] h-[400px] flex flex-col border border-[#F5F5F5] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            {/* Imagen */}
            <div className="relative w-full h-[200px]">
                <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>

            {/* Contenido */}
            <div className="flex-grow p-4">
                <div className="flex items-center text-sm text-[#333333] mb-2">
                    <Calendar className="w-4 h-4 mr-1 text-[#078930]" />
                    <span>{date}</span>
                    <span className="mx-2 text-[#CF251F]">•</span>
                    <Clock className="w-4 h-4 mr-1 text-[#078930]" />
                    <span>{readTime} min read</span>
                </div>
                <h2 className="text-lg font-bold line-clamp-2 mb-2 text-[#CF251F]">{title}</h2>
                <p className="text-sm text-[#333333] line-clamp-3">{summary}</p>
            </div>

            {/* Botón "Leer más" */}
            <div className="p-4">
                <a
                    href={readMoreLink}
                    className="block w-full bg-[#078930] text-white text-center py-2 px-4 rounded-lg hover:bg-[#CF251F] transition-colors duration-300"
                >
                    Leer más
                </a>
            </div>
        </div>
    );
}