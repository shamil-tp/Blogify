import { createBrowserRouter, Navigate } from "react-router-dom"; 
import RootLayout from "../layouts/RootLayout";
import CreatePost from "../pages/CreatePost";
import BlogView from "../pages/BlogView";
import Login from "../pages/login";
import HomeFeed from "../pages/HomeFeed"; 

const route = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/home" replace />
            },
            {
                path: "/home",
                element: <HomeFeed />, 
            },
            {
                path: "/create", 
                element: <CreatePost />,
            },
            {
                path: "/viewPost", 
                element: <BlogView />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default route;