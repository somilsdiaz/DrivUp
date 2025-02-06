import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Inicio from '../pages/inicio';
import Rutas from '../pages/rutas';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import SolicitarRutaPagina from '../pages/PaginaSolicitarRutas';
import NoticiasPage from '../pages/NoticiasPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
const router = createBrowserRouter([
    {
        path: "/login", // Ruta para el login
        element: <Login />,
    },
    {
        path: "/register", // Ruta para el login
        element: <Register />,
    },
    {
        path: "/",
        element: <Inicio />,
    },
    {
        path: "/rutas",
        element: <Rutas />,
    },
    {
        path: "/solicitar-mi-ruta",
        element: <SolicitarRutaPagina />,
    },
    {
        path: "/contacto",
        element: <Contacto />,
    },
    {
        path: "/acerca-de",
        element: <About />,
    },
    {
        path: "/noticias/:id", // Ruta dinámica para las noticias
        element: <NoticiasPage />,
    },    
    {
        path: "/politicas-de-privacidad", 
        element: <PrivacyPolicy />,
    },
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
