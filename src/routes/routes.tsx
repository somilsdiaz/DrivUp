import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Inicio from '../pages/inicio';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermCondition from '../pages/termConditionPage';
import HomeConductor from '../pages/vistaConductores/homeConductor';
import RequestPage from '../pages/vistaConductores/requestPage';

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
        path: "/contacto",
        element: <Contacto />,
    },
    {
        path: "/acerca-de",
        element: <About />,
    },
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
    },
    {
        path:"/dashboard/conductor/solicitudes",
        element:<RequestPage></RequestPage>
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
