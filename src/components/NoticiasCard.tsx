interface NoticiasCardProps {
    title: string;
    summary: string;
    imageUrl: string;
    readMoreLink: string;
}

export function NoticiasCard({ title, summary, imageUrl, readMoreLink }: NoticiasCardProps) {
    return (
        <div className="w-[300px] h-[400px] flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Imagen */}
            <div className="relative w-full h-[200px]">
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenido */}
            <div className="flex-grow p-4">
                <h2 className="text-lg font-bold line-clamp-2 mb-2">{title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
            </div>

            {/* Botón "Leer más" */}
            <div className="p-4">
                <a
                    href={readMoreLink}
                    className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    Leer más
                </a>
            </div>
        </div>
    );
}