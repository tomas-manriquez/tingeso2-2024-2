import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequestService from "../services/request.service.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const RequestStatus = () => {
    const [request, setRequest] = useState([]);

    const navigate = useNavigate();

    const init = (id) => {
        RequestService
            .get(id)
            .then((response) => {
                console.log("Mostrando la Solicitud", response.data);
                setRequest(response.data);
            })
            .catch((error) => {
                console.log(
                    "Se ha producido un error al intentar mostrar la Solicitud.",
                    error
                );
            });
    };

    useEffect((id) => {
        init(id);
    }, []);

    //se elimino opcion de eliminar request desde menu de estado: borrar solamente desde lista
    const handleDelete = (id) => {
        console.log("Printing id", id);
        const confirmDelete = window.confirm(
            "¿Esta seguro que desea borrar esta Solicitud?"
        );
        if (confirmDelete) {
            RequestService
                .remove(id)
                .then((response) => {
                    console.log("Solicitud ha sido eliminada.", response.data);
                    init(id);
                })
                .catch((error) => {
                    console.log(
                        "Se ha producido un error al intentar eliminar la Solicitud",
                        error
                    );
                });
        }
    };

    const handleEdit = (id) => {
        console.log("Printing id", id);
        navigate(`/request/edit/${id}`);
    };

    return (
        <TableContainer component={Paper}>
            <br />
            <Link
                to="/request/add"
                style={{ textDecoration: "none", marginBottom: "1rem" }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MoreTimeIcon />}
                >
                    Ingresar Solicitud
                </Button>
            </Link>
            <br /> <br />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Rut Cliente
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Tipo
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Estado
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow
                            key={request.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell align="left">{request.clientRut}</TableCell>
                            <TableCell align="left">{request.type}</TableCell>
                            <TableCell align="right">{request.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleEdit(request.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(request.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<DeleteIcon />}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default RequestStatus;
