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
import Configuracion from '../pages/configuracion';
import SolicitudesPage from '../pages/vistaConductores/solicitudesPage';
import BandejaMensajes from '../pages/vistaPasajeros/bandejaMensajes';
import ListaConductores from '../pages/vistaPasajeros/listaConductores';
import PageDetallesConductor from '../pages/pageDetallesConductor';
import ListaPasajeros from '../pages/vistaConductores/listaPasajeros';
import { PreferenciasViajes } from '../pages/preferenciasViajes';
import SolicitarViaje from '../pages/vistaPasajeros/solicitarViaje';
import ListaViajes from '../pages/vistaConductores/listaViajes';
import InProcess from '../components/skeletons/inProcess';

const router = createBrowserRouter([
    //<PublicRoute> si el usuario esta autenticado no puede acceder a la pagina 
    //<ProtectedRoute> si el usuario no esta autenticado no puede acceder a la pagina y redirige a la pagina de login
    //<RoleBasedRoute> si el usuario no tiene el rol permitido no puede acceder a la pagina
    {
        path: "/dashboard/conductor/lista-viajes",
        element:(                 
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["conductor"]}
                    redirectPath="/dashboard/conductor"
                >
                    <ListaViajes />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/conductor/lista-pasajeros",
        element:(                 
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["conductor"]}
                    redirectPath="/dashboard/conductor"
                >
                    <ListaPasajeros />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/pasajero/lista-conductores",
        element:(                 
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <ListaConductores />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/pasajero/solicitar-viaje",
        element:(                 
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"  
                >
                    <SolicitarViaje />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/conductor/configuracion",
        element: (                
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["conductor y pasajero"]}  
                    redirectPath="/dashboard/conductor"
                >
                    <Configuracion />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
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
        path: "/dashboard/pasajero/mi-bandeja-de-mensajes",
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
    },{
        path:"/dashboard/conductor/solicitudes/detallesConductor",
        element:(
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                     <PageDetallesConductor/>
                </RoleBasedRoute>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard/pasajero/preferencias-viajes",
        element:(                 
            <ProtectedRoute>
                <RoleBasedRoute
                    allowedRoles={["pasajero"]}
                    redirectPath="/dashboard/pasajero"
                >
                    <PreferenciasViajes />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/en-proceso",
        element: <InProcess />
    }
    
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
