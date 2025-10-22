import { createHashRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import ForumPage from "../sections/ForumSection/Components/ForumPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "foro", element: <ForumPage /> },
    ],
  },
]);
