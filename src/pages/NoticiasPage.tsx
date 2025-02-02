
import type React from "react"

interface NoticiasPageProps {
    title: string
    subtitle: string
    content: string
    image?: string; // (opcional)

}

const NoticiasPage: React.FC<NoticiasPageProps> = ({ title, subtitle, content, image }) => {
    return (
        <article className="max-w-3xl mx-auto">
            <h1 className="text-custom-red text-4xl font-bold mb-4">{title}</h1>
            <h2 className="text-custom-green text-2xl mb-6">{subtitle}</h2>
            {/* Imagen (si está presente) */}
            {image && (
                <div className="mb-8">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            )}
            <div className="text-custom-gray-dark mb-8">
                {content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
        </article>
    )
}
export default NoticiasPage

