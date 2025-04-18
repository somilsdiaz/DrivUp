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
import HomePasajeros from '../pages/vistaPasajeros/homePasajeros';
import DriverRegister from '../pages/DriverRegister';

const router = createBrowserRouter([
    {
        path: "/driver-register", 
        element: <DriverRegister />,
    },
    {
        path: "/login", 
        element: <Login />,
    },
    {
        path: "/register", 
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
    },
    {
        path:"/dashboard/pasajero",
        element:<HomePasajeros/>
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
