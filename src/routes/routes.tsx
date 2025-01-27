import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import Inicio from '../pages/inicio';

const router = createBrowserRouter([
    {
        path: "/login", // Ruta para el login
        element: <Login />,
    },
    {
        path:"/",
        element: <Inicio />,
    },

]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
