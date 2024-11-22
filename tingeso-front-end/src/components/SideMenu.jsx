import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalculateIcon from "@mui/icons-material/Calculate";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DiscountIcon from "@mui/icons-material/Discount";
import HailIcon from "@mui/icons-material/Hail";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import {ListItemIcon, ListItemText} from "@mui/material";

export default function Sidemenu({ open, toggleDrawer }) {
    const navigate = useNavigate();

    const listOptions = () => (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <List>
                <ListItemButton onClick={() => navigate("/home")}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>

                <Divider />

                <ListItemButton onClick={() => navigate("/client/list")}>
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/request/list")}>
                    <ListItemIcon>
                        <MoreTimeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Solicitudes" />
                </ListItemButton>


                <ListItemButton onClick={() => navigate("/request/calculate")}>
                    <ListItemIcon>
                        <CalculateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Simular Credito" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/request/status")}>
                    <ListItemIcon>
                        <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Estado Solicitud" />
                </ListItemButton>
            </List>

            <Divider />

            <List>
                <ListItemButton onClick={() => navigate("/client/add")}>
                    <ListItemIcon>
                        <DiscountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registrar Cliente" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/request/add")}>
                    <ListItemIcon>
                        <HailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registrar/Evaluar Solicitud" />
                </ListItemButton>

            </List>
        </Box>
    );

    return (
        <div>
            <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
                {listOptions()}
            </Drawer>
        </div>
    );
}
