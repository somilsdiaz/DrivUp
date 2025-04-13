import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Inicio from '../pages/inicio';
<<<<<<< HEAD
import Rutas from '../pages/rutas';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import SolicitarRutaPagina from '../pages/PaginaSolicitarRutas';
=======
import Contacto from '../pages/contacto';
import About from '../pages/about';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermCondition from '../pages/termConditionPage';
import HomeConductor from '../pages/vistaConductores/homeConductor';
>>>>>>> main

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
<<<<<<< HEAD
        path: "/rutas",
        element: <Rutas />,
    },
    {
        path: "/solicitar-mi-ruta",
        element: <SolicitarRutaPagina />,
    },
    {
=======
>>>>>>> main
        path: "/contacto",
        element: <Contacto />,
    },
    {
        path: "/acerca-de",
        element: <About />,
    },
<<<<<<< HEAD
=======
    {
        path: "/politicas-de-privacidad", 
        element: <PrivacyPolicy />,
    },
    {
        path:"/Terminos-y-condiciones",
        element:<TermCondition/>
    },
    {
        path:"/dashboard/conductor",
        element:<HomeConductor></HomeConductor>
    }
>>>>>>> main
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
