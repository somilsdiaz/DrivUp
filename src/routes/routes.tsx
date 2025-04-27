import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Inicio from '../pages/inicio';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermCondition from '../pages/termConditionPage';
import HomeConductor from '../pages/vistaConductores/homeConductor';
import HomePasajeros from '../pages/vistaPasajeros/homePasajeros';
import DriverRegister from '../pages/DriverRegister';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import SolicitudesPage from '../pages/vistaConductores/solicitudesPage';
import BandejaMensajes from '../pages/vistaPasajeros/bandejaMensajes';

const router = createBrowserRouter([
    //<PublicRoute> si el usuario esta autenticado no puede acceder a la pagina 
    //<ProtectedRoute> si el usuario no esta autenticado no puede acceder a la pagina y redirige a la pagina de login
    //<RoleBasedRoute> si el usuario no tiene el rol permitido no puede acceder a la pagina

    {
        path: "/driver-register",
        element: (
            //proteger la ruta para que solo los pasajeros puedan acceder
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <DriverRegister />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/mi-bandeja-de-mensajes",
        element: (
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <BandejaMensajes />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        element: (
            <PublicRoute>
                <Inicio />,
            </PublicRoute>
        )
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
        path: "/Terminos-y-condiciones",
        element: <TermCondition />
    },
    {
        path: "/dashboard/conductor",
        //proteger la ruta para que solo los conductores puedan acceder
        element: (
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["conductor y pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <HomeConductor />
                </RoleBasedRoute>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/conductor/solicitudes",
        //proteger la ruta para que solo los conductores puedan acceder
        element: (
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["conductor y pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <SolicitudesPage />
                </RoleBasedRoute>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/pasajero",
        //proteger la ruta para que solo los pasajeros puedan acceder
        element: (
            <ProtectedRoute>
                <HomePasajeros />
            </ProtectedRoute>
        )
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
