import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Evolutions from "./pages/Evolutions.jsx";
import VisualizerTest from "./pages/VisualizerTest.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        index: true,
        element: <Home />,
      },
      {
        path:"/evolutions",
        element: <Evolutions/>
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/visualizer",
        element: <VisualizerTest />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);