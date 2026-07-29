import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ClientsPage from "../pages/ClientsPage.jsx";
import ClientFormPage from "../pages/ClientFormPage.jsx";
import PolicySimulatorPage from "../pages/PolicySimulatorPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "clients",
                element: <ClientsPage />,
            },
            {
                path: "clients/new",
                element: <ClientFormPage />,
            },
            {
                path: "clients/:id/edit",
                element: <ClientFormPage />,
            },
            {
                path: "policies",
                element: <PolicySimulatorPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}