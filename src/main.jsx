import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "mapbox-gl/dist/mapbox-gl.css";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        margin: 0,
        minHeight: "100vh",
        padding: 0,
        height: "100%",
        bgGradient: "linear(to-b, blue.100, blue.50, blue.100)",
        backgroundAttachment: "fixed",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
