import CloseIcon from "@mui/icons-material/Close";
import {IconButton} from "@mui/material";
import {closeSnackbar, SnackbarProvider} from 'notistack'

export function GlobalSnackbarProvider({children}: {children: React.ReactNode }) {
    return (
        <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            // maxSnack={3}
            // autoHideDuration={3000}
            preventDuplicate
            action={(key) => (
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => closeSnackbar(key)}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        >
            {children}
        </SnackbarProvider>
    );
}