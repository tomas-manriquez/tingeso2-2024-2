import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Sidemenu from "./SideMenu.jsx";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        setOpen(open);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PrestaBancoWeb: Sistema de Gestión Hipotecas
                    </Typography>
                    <Button color="inherit">Registrar Cliente</Button>
                </Toolbar>
            </AppBar>

            <Sidemenu open={open} toggleDrawer={toggleDrawer}></Sidemenu>
        </Box>
    );
}
