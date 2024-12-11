import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CreditRequestService from "../services/m3-solicitud-credito.service.js";
import TrackRequestService from "../services/m5-seguimiento-solicitud.service.js"
import CreditEvalService from "../services/m4-evaluacion-credito.service.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell  from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import InfoIcon from '@mui/icons-material/Info';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [trackDetails, setTrackDetails] = useState('');

    const navigate = useNavigate();

    const init = async () => {
        await CreditRequestService
            .getAllCreditRequestsWithCredits()
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
            CreditRequestService
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

    const handleStatus = (id) =>{
        TrackRequestService.trackRequest(id)
            .then((response) => {
                setTrackDetails(response.data);
                setOpenDialog(true);
            })
            .catch((error) => {
                console.log("Error tracking request", error);
                setTrackDetails('No se pudieron obtener los detalles de seguimiento');
                setOpenDialog(true);
            });
    };

    const handleEval= (id) =>{
        CreditEvalService.requestEvaluation(id)
            .then((response) => {
                console.log("Evaluacion realizada: ",response.data)
            })
            .catch((error) => {
                console.log("Error evaluating request", error);
            });
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
                           UserId
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                           FinEvalId
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            CreditId
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Estado
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Tipo de Credito
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request, index) => (
                        <TableRow
                            key={request.id || index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell align="left">{request.finEval.userId ?request.finEval.userId : 'N/A'}</TableCell>
                            <TableCell align="left">{request.finEval.finEvalId}</TableCell>
                            <TableCell align="left">{request.credits ? request.credits.creditId : 'N/A'}</TableCell>
                            <TableCell align="right">{request.finEval.status}</TableCell>
                            <TableCell align="left">{request.credits ? request.credits.type : 'N/A'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleEdit(request.finEval.finEvalId)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(request.finEval.finEvalId)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<DeleteIcon />}
                                >
                                    Eliminar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleStatus(request.finEval.finEvalId)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<InfoIcon />}
                                >
                                    Status
                                </Button>

                                <Dialog
                                    open={openDialog}
                                    onClose={() => setOpenDialog(false)}
                                    aria-labelledby="track-request-dialog"
                                >
                                    <DialogTitle>Detalles de Seguimiento</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {trackDetails}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDialog(false)} color="primary">
                                            Cerrar
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleEval(request.finEval.finEvalId)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<InfoIcon />}
                                >
                                    Evaluacion
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
