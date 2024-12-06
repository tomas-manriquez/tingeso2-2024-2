import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserRegisterService from "../services/actual-registro-usuario.service.js";

const ClientList = () => {
    const [clients, setClients] = useState([]);

    const navigate = useNavigate();

    const init = () => {
        UserRegisterService
            .findAll()
            .then((response) => {
                console.log("Mostrando listado de todos los clientes.", response.data);
                setClients(response.data);
            })
            .catch((error) => {
                console.log(
                    "Se ha producido un error al intentar mostrar listado de todos los clientes.",
                    error
                );
            });
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        console.log("Updated client state:", clients);
    }, [clients]);

    const handleDelete = (user) => {
        console.log("Updated client state:", user);
        const confirmDelete = window.confirm(
            "¿Esta seguro que desea borrar este cliente?"
        );
        if (confirmDelete) {
            UserRegisterService
                .remove(user)
                .then((response) => {
                    console.log("cliente ha sido eliminado.", response.data);
                    init();
                })
                .catch((error) => {
                    console.log(
                        "Se ha producido un error al intentar eliminar al cliente",
                        error
                    );
                });
        }
    };

    const handleEdit = (id) => {
        console.log("Printing id", id);
        navigate(`/client/edit/${id}`);
    };



    return (
        <TableContainer component={Paper}>
            <br />
            <Link
                to="/client/add"
                style={{ textDecoration: "none", marginBottom: "1rem" }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                >
                    Añadir Cliente
                </Button>
            </Link>
            <br /> <br />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>UserId</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Rut</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Apellido</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Cumpleaños</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Estado</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Documentos</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Documentos Validos</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Acciones</TableCell>


                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((client, index) => (
                        <TableRow
                            key={client.id || index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell align="left">{client.userId}</TableCell>
                            <TableCell align="left">{client.rut}</TableCell>
                            <TableCell align="left">{client.firstName}</TableCell>
                            <TableCell align="right">{client.lastName}</TableCell>
                            <TableCell align="right">{client.birthday}</TableCell>
                            <TableCell align="right">{client.status}</TableCell>
                            <TableCell align="right">
                                {client.documents && client.documents.length > 0
                                    ? client.documents.map((doc, index) => (
                                        <div key={index}>
                                            <Link to={`/documents/${doc.id}`} target="_blank">
                                                {doc.name}
                                            </Link>
                                        </div>
                                    ))
                                    : "No documents"}
                            </TableCell>
                            <TableCell align="right">
                                {client.hasValidDocuments ? "Sí" : "No"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleEdit(client.userId)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(client)}
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

export default ClientList;
