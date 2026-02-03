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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <GlobalSnackbarProvider>
                        <RouterProvider router={router} />
                    </GlobalSnackbarProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>
)
