import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import HeaderFooter from '../layouts/headerFooter';


interface Noticia {
    id: number;
    title: string;
    date: string;
    subtitle: string;
    content: string;
    imageUrl?: string;
    empresa: string;
}

const NoticiasPage: React.FC = () => {

    const { id } = useParams<{ id: string }>(); // Obtén el id de la URL
    const [noticia, setNoticia] = useState<Noticia | null>(null);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const response = await fetch(`http://localhost:5000/noticias/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener la noticia');
                }
                const data = await response.json();
                setNoticia(data);
            } catch (error) {
                console.error('Error fetching noticia:', error);
            }
        };

        fetchNoticia();
    }, [id]);

    if (!noticia) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <HeaderFooter>
            <article className="max-w-3xl mx-auto">
                <h1 className="text-custom-red text-4xl font-bold mb-4">{noticia.title}</h1>
                <div className="flex items-center text-sm text-[#333333] mb-2">
                    <Calendar className="w-4 h-4 mr-1 text-[#078930]" />
                    <span>{noticia.date}</span>
                    <span className="mx-2 text-[#CF251F]">•</span>
                    <span>{noticia.empresa}</span>
                </div>
                <h2 className="text-custom-green text-2xl mb-6">{noticia.subtitle}</h2>
                {/* Imagen (si está presente) */}
                {noticia.imageUrl && (
                    <div className="mb-8">
                        <img
                            src={noticia.imageUrl}
                            alt={noticia.title}
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                )}
                <div className="text-custom-gray-dark mb-8">
                    {noticia.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </article>
        </HeaderFooter>

    )
}
export default NoticiasPage

