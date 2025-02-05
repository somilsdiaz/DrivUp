import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import HeaderFooter from '../layouts/headerFooter';
import { NoticiasSection } from '../components/NoticiasSeccion';
import PageNewsSkeletonLoading from '../components/pageNewsSkeleton/PageNewsSkeletonLoading';

interface Noticia {
    id: number;
    title: string;
    date: string;
    subtitle: string;
    content: string;
    imageurl?: string;
    empresa: string;
}

const NoticiasPage: React.FC = () => {

    const { id } = useParams<{ id: string }>(); // Obtén el id de la URL
    const [noticia, setNoticia] = useState<Noticia | null>(null);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const response = await fetch(`https://unibus-backend.onrender.com/noticias/${id}`);
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
        return (
            <HeaderFooter>
                <PageNewsSkeletonLoading />
            </HeaderFooter>
        ); // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <HeaderFooter>
            <article className="max-w-3xl mx-auto md:p-0 p-5 md:pt-9">
                <h1 className="text-[#CF251F] text-4xl font-bold mb-4">{noticia.title}</h1>
                <div className="flex items-center text-sm text-[#333333] mb-2">

                    <Calendar className="w-4 h-4 mr-1 text-[#078930]" />
                    <span>{new Date(noticia.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="mx-2 text-[#CF251F]">•</span>
                    <span>{noticia.empresa}</span>
                </div>
                <h2 className="text-[#078930] text-2xl mb-6">{noticia.subtitle}</h2>
                {/* Imagen (si está presente) */}
                {noticia.imageurl && (
                    <div className="mb-8">
                        <img
                            src={noticia.imageurl}
                            alt={noticia.title}
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                )}
                <div className="text-[#333333] mb-8 text-justify">
                    {noticia.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4">
                            {paragraph}
                        </p>
                    ))}
                </div>
                <NoticiasSection />
            </article>
        </HeaderFooter>
    )
}
export default NoticiasPage

