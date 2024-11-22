import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import clientService from "../services/client.service.js";
import documentService from "../services/document.service.js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import {Checkbox, FormControlLabel} from "@mui/material";
import Box from "@mui/material/Box";

const AddEditClient= () => {
    const [rut, setRut] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [status, setStatus] = useState("");
    const [hasValidDocuments, setHasValidDocuments] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState(null);
    const { id } = useParams();
    const [titleClientForm, setTitleClientForm] = useState("");
    const navigate = useNavigate();

    const saveClient= (e) => {
        e.preventDefault();

        const client = { rut, firstName, lastName, birthday, status, hasValidDocuments, documents, id };
        if (id) {
            //Actualizar Datos Empleado
            clientService
                .update(client)
                .then((response) => {
                    console.log("Empleado ha sido actualizado.", response.data);
                    navigate("/client/list");
                })
                .catch((error) => {
                    console.log(
                        "Ha ocurrido un error al intentar actualizar datos del cliente.",
                        error
                    );
                });
        } else {
            //Crear nuevo empleado
            clientService
                .create(client)
                .then((response) => {
                    console.log("Empleado ha sido añadido.", response.data);
                    navigate("/client/list");
                })
                .catch((error) => {
                    console.log(
                        "Ha ocurrido un error al intentar crear nuevo cliente.",
                        error
                    );
                });
        }
    };

    const uploadDocument = (e) => {
        e.preventDefault();
        if (!newDocument) return;

        const formData = new FormData();
        formData.append("file", newDocument);
        formData.append("clientId", id);
        formData.append("requestId", null); // Null porque siempre va a ser de un cliente, no de un request

        documentService.upload(formData).then((response) => {
            console.log("Documento subido al sistema.", response.data);
            fetchDocuments(); // Refresh document list after upload
        }).catch((error) => {
            console.log("Error subiendo el documento.", error);
        });
    };

    const downloadDocument = (documentId) => {
        documentService.download(documentId).then((response) => {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;    //link con el que interactua el usuario
            link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')); //nombre de archivo
            document.body.appendChild(link);    //cuerpo del archivo (el contenido)
            link.click();
            link.remove();
        }).catch((error) => {
            console.log("Error descargando el documento.", error);
        });
    };

    const deleteDocument = (documentId) => {
        if (window.confirm("Está seguro que quiere eliminar el documento?")) {
            documentService.remove(documentId).then(() => {
                console.log("Documento eliminado.");
                fetchDocuments(); //Actualizar lista de documentos
            }).catch((error) => {
                console.log("Error eliminando el documento.", error);
            });
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await documentService.getAll();
            const clientDocuments = response.data.filter(doc => doc.clientId === id); //Filtrar para que sean del cliente
            setDocuments(clientDocuments);
        } catch (error) {
            console.log("Error fetching documents:", error);
        }
    };


    useEffect(() => {
        if (id) {
            setTitleClientForm("Editar Cliente");
            clientService
                .get(id)
                .then((client) => {
                    setRut(client.data.rut);
                    setFirstName(client.data.firstName);
                    setLastName(client.data.lastName);
                    setBirthday(client.data.birthday);
                    setStatus(client.data.children);
                    setHasValidDocuments(client.data.hasValidDocuments);
                })
                .catch((error) => {
                    console.log("Se ha producido un error.", error);
                });
        } else {
            setTitleClientForm("Nuevo Cliente");
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
        >
            <h3> {titleClientForm} </h3>
            <hr />
            <form>
                <FormControl fullWidth>
                    <TextField
                        id="rut"
                        label="Rut"
                        value={rut}
                        variant="standard"
                        onChange={(e) => setRut(e.target.value)}
                        helperText="Ej. 12.587.698-8"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="first_name"
                        label="First Name"
                        value={firstName}
                        variant="standard"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="last_name"
                        label="last Name"
                        value={lastName}
                        variant="standard"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="birthday"
                        label="Birthday"
                        type="date"
                        value={birthday}
                        variant="standard"
                        onChange={(e) => setBirthday(e.target.value)}
                        helperText="fecha de nacimiento"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="status"
                        label="Status"
                        value={status}
                        variant="standard"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value="espera">Espera</MenuItem>
                        <MenuItem value="validado">Validado</MenuItem>
                        <MenuItem value="rechazado">Rechazado</MenuItem>
                    </TextField>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={hasValidDocuments}
                            onChange={(e) => setHasValidDocuments(e.target.checked)}
                        />
                    }
                    label="Has Valid Documents"
                />

                {/* Subir documento */}
                <FormControl fullWidth>
                    <input type="file" onChange={(e) => setNewDocument(e.target.files[0])} />
                    {/*startIcon={<UploadIcon />}*/}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={uploadDocument} >
                        Subir Documento a Sistema
                    </Button>
                </FormControl>

                {/* Lista de documentos + descargar + eliminar*/}
                {/*startIcon={<DownloadIcon />}*/}
                <div>
                    <h4>Documents</h4>
                    {documents.length > 0 ? documents.map(doc => (
                        <div key={doc.id}>
                            <span>{doc.name}</span>
                            <Button onClick={() => downloadDocument(doc.id)} >
                                Descargar
                            </Button>
                            <Button onClick={() => deleteDocument(doc.id)}  color="error">
                                Eliminar
                            </Button>
                        </div>
                    )) : <p>No hay documentos disponibles.</p>}
                </div>

                <FormControl>
                    <br />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={(e) => saveClient(e)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<SaveIcon />}
                    >
                        Grabar
                    </Button>
                </FormControl>
            </form>
            <hr />
            <Link to="/client/list">Back to List</Link>
        </Box>
    );
};

export default AddEditClient;
