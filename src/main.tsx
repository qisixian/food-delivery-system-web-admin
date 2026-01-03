import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import { theme } from "./theme";
import { RouterProvider } from "react-router";
import { router } from "@/router";
// import App from './App.tsx'
import './index.css'
import {GlobalSnackbarProvider} from "@/providers/GlobalSnackbarProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalSnackbarProvider>
                    <RouterProvider router={router} />
                </GlobalSnackbarProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>
)
