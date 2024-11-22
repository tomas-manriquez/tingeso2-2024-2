import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requestService from "../services/request.service.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell  from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const RequestList = () => {
    const [requests, setRequests] = useState([]);

    const navigate = useNavigate();

    const init = () => {
        requestService
            .getAll()
            .then((response) => {
                console.log("Mostrando listado de todos las Solicitudes", response.data);
                setRequests(response.data);
            })
            .catch((error) => {
                console.log(
                    "Se ha producido un error al intentar mostrar listado de todas las Solicitudes.",
                    error
                );
            });
    };

    useEffect(() => {
        init();
    }, []);

    const handleDelete = (id) => {
        console.log("Printing id", id);
        const confirmDelete = window.confirm(
            "¿Esta seguro que desea borrar esta Solicitud?"
        );
        if (confirmDelete) {
            requestService
                .remove(id)
                .then((response) => {
                    console.log("Solicitud ha sido eliminada.", response.data);
                    init();
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
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Rut Cliente
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Tipo
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Estado
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request) => (
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RequestList;
