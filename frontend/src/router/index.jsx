import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import RootLayout from "../layouts/RootLayout";
import HomeFeed from "../pages/HomeFeed";
import CreatePost from "../pages/CreatePost";
import BlogView from "../pages/BlogView";
import Login from "../pages/login";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: "home", element: <HomeFeed /> },
          { path: "create", element: <CreatePost /> },
          { path: "viewPost", element: <BlogView /> }
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
]);

export default router; // ✅ THIS FIXES THE ERROR
