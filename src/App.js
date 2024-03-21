import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RootLayout from "./components/RootLayout";
import Page404 from "./pages/Page404";
import Page500 from "./pages/Page500";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HistoryDetail from "./pages/HistoryDetail";
import Products from "./pages/Products";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Chat from "./pages/Chat";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/sign-up",
          element: <SignUp />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        { path: "/history-detail/:id", element: <HistoryDetail /> },
        { path: "/products", element: <Products /> },
        { path: "/add", element: <Add /> },
        { path: "/update/:id", element: <Update /> },
        { path: "/chat", element: <Chat /> },
      ],
    },
    { path: "*", element: <Page404 /> },
    { path: "server-error", element: <Page500 /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
