import { createBrowserRouter, Navigate } from "react-router-dom"; // Added Navigate
import RootLayout from "../layouts/RootLayout";
import CreatePost from "../pages/CreatePost";
import BlogView from "../pages/BlogView";
import Login from "../pages/login";
import HomeFeed from "../pages/HomeFeed"; // You likely need a real home page

const route = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // 1. Fix Blank Page: Redirect "/" to "/home" automatically
            {
                index: true,
                element: <Navigate to="/home" replace />
            },
            {
                path: "/home",
                // 2. Fix Naming: This should probably be the feed, not the create page
                element: <HomeFeed />, 
            },
            {
                path: "/create", // clearer path name
                element: <CreatePost />,
            },
            {
                path: "/viewPost", // Consider "/viewPost/:id" for specific blogs later
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