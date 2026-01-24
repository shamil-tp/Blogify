import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import RootLayout from "../layouts/RootLayout";
import HomeFeed from "../pages/HomeFeed";
import CreatePost from "../pages/CreatePost";
import BlogView from "../pages/BlogView";
import Login from "../pages/login";

import StartPage from "../pages/startPage";

const router = createBrowserRouter([
  { path: "/", element: <StartPage /> },
  { path: "/login", element: <Login /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "/home", element: <HomeFeed /> },
          { path: "/create", element: <CreatePost /> },
          { path: "/viewPost", element: <BlogView /> }
        ]
      }
    ]
  }
]);


export default router; // ✅ THIS FIXES THE ERROR
