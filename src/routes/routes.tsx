import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inicio from '../pages/inicio';

const router = createBrowserRouter([
    {
        path:"/",
        element: <Inicio />,
    },

]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
