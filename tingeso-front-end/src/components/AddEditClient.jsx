import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import UserRegisterService from "../services/actual-registro-usuario.service.js";
import creditRequestService from "../services/m3-solicitud-credito.service.js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import {Checkbox, FormControlLabel} from "@mui/material";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const AddEditClient = () => {
    const [client, setClient] = useState({
        userid: null,
        rut: "",
        firstName: "",
        lastName: "",
        birthday: "",
        status: "",
        hasValidDocuments: true,
        documentsIds: [],
    });
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreview, setFilePreview] = useState([]);
    const {id} = useParams();
    const [titleClientForm, setTitleClientForm] = useState("Nuevo Cliente");
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewDocument, setPreviewDocument] = useState(null);

    const openDocumentPreview = (documentId) => {
        creditRequestService.getDocument(documentId).then((response) => {
            console.log('Response headers:', response.headers);
            console.log('Response data:', response.data);
            // Create a blob directly from the response data
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/octet-stream'
            });

            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            setPreviewDocument(url);
        }).catch((error) => {
            console.log("Error previewing the document.", error);
            alert("Could not preview the document.");
        });
    };

    // Add a cleanup to revoke the object URL when the component unmounts or preview closes
    useEffect(() => {
        return () => {
            if (previewDocument) {
                URL.revokeObjectURL(previewDocument);
            }
        };
    }, [previewDocument]);

    const closeDocumentPreview = () => {
        setPreviewDocument(null);
    };


    const saveClient = (e) => {
        e.preventDefault(); // Prevent form submission

        // Check if `id` is available (editing an existing client)
        if (id) {
            // Update Client
            const updatedClient = { ...client, id }; // Add `id` to the client object
            UserRegisterService
                .save(client) // Call the update service
                .then((response) => {
                    console.log("Client has been updated successfully:", response.data);
                    navigate("/client/list"); // Navigate back to the client list
                })
                .catch((error) => {
                    console.error(
                        "An error occurred while updating the client:",
                        error
                    );
                });
        } else {
            // Create a New Client
            const newClient = { ...client, id: null }; // Ensure `id` is null for new clients
            UserRegisterService
                .register(newClient) // Call the register service
                .then((response) => {
                    console.log("Client has been added successfully:", response.data);
                    navigate("/client/list"); // Navigate back to the client list
                })
                .catch((error) => {
                    console.error(
                        "An error occurred while creating a new client:",
                        error
                    );
                });
        }
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setClient(prevClient => ({
            ...prevClient,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const uploadMultipleUserDocuments = async (files) => {
        try {
            // Create an array to store document IDs
            const documentPromises = files.map(file =>
                creditRequestService.uploadUserDocument(file, id)
            );

            // Wait for all uploads to complete
            const uploadedDocuments = await Promise.all(documentPromises);

            // Extract document IDs from the upload responses
            const documentIds = uploadedDocuments.map(doc => doc.id);

            // Update client's documentsIds
            setClient(client => ({
                ...client,
                documentsIds: [...(client.documentsIds || []), ...documentIds],
            }));

            await UserRegisterService.save(client);
            return documentIds;
        } catch (error) {
            console.error("Error uploading multiple documents:", error);
            alert("Error uploading documents. Please try again.");
            return [];
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        // Update selected files
        setSelectedFiles(files);

        // Create file previews
        const previews = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file)
        }));
        setFilePreview(previews);
    };

    const removeFilePreview = (index) => {
        // Remove file from selected files and previews
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = filePreview.filter((_, i) => i !== index);

        setSelectedFiles(updatedFiles);
        setFilePreview(updatedPreviews);
    };

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
    const validateFiles = (files) => {
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                return `File ${file.name} is too large. Max file size is 10MB.`;
            }
        }
        return null; // No errors
    };
    const handleUploadDocuments = async () => {
        const errorMessage = validateFiles(selectedFiles);
        if (errorMessage) {
            alert(errorMessage); // Display error to the user
            return;
        }
        if (!id) {
            alert("Please save the client first before uploading documents.");
            return;
        }

        if (selectedFiles.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        try {
            // Upload documents and get their IDs
            await uploadMultipleUserDocuments(selectedFiles, id);

            // Refresh documents list
            await fetchDocuments();

            // Clear file selection
            setSelectedFiles([]);
            setFilePreview([]);

            alert("Documents uploaded successfully!");
        } catch (error) {
            console.error("Error in document upload:", error);
        }
    };

    const downloadDocument = (documentId) => {
        creditRequestService.getDocument(documentId)
            .then((response) => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Extract filename or provide a fallback
                const contentDisposition = response.headers['content-disposition'];
                const fallbackFilename = "downloaded_document";
                const filename = contentDisposition
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                    : fallbackFilename;

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((error) => {
                console.log("Error descargando el documento.", error);
            });
    };


    const deleteDocument = (documentId) => {
        if (window.confirm("Está seguro que quiere eliminar el documento?")) {
            creditRequestService.remove(documentId).then(() => {
                console.log("Documento eliminado.");
                fetchDocuments(); //Actualizar lista de documentos
            }).catch((error) => {
                console.log("Error eliminando el documento.", error);
            });
        }
    };

    const fetchDocuments = async () => {
        if (!id) {
            console.error("User ID is missing. Unable to fetch documents.");
            return;
        }
        console.log("Sending document IDs to backend:", client.documentsIds);
        try {
            const response = await creditRequestService.getAllDocuments(client.documentsIds); // Pass user ID to the service method
            const clientDocuments = response.data;
            setDocuments(clientDocuments);
        } catch (error) {
            console.log("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        if (id) {
            setTitleClientForm("Editar Cliente");
            UserRegisterService
                .findById(id)
                .then((response) => {
                    const clientData = response.data;
                    setClient({
                        userId: clientData.userId || null,
                        rut: clientData.rut || "",
                        firstName: clientData.firstName || "",
                        lastName: clientData.lastName || "",
                        birthday: clientData.birthday || "",
                        status: clientData.status || "",
                        hasValidDocuments: clientData.hasValidDocuments ?? true,
                        documentsIds: clientData.documentsIds || [],
                    });
                    // Fetch and update the documents state
                })
                .catch((error) => {
                    console.log("Se ha producido un error.", error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (client.documentsIds && client.documentsIds.length > 0) {
            console.log("Fetching documents for client:", client.documentsIds);
            fetchDocuments();
        }
    }, [client]); // Only runs when `client` changes

    useEffect(() => {
        console.log("Updated client state:", client);
        console.log("document list: ",documents);
    }, [client, documents]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={saveClient}
        >
            <h3>{titleClientForm}</h3>
            <hr/>
                <FormControl fullWidth>
                    <TextField
                        id="rut"
                        label="Rut"
                        value={client.rut}
                        variant="standard"
                        onChange={handleInputChange}
                        helperText="Ej. 12.587.698-8"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="firstName"
                        label="First Name"
                        value={client.firstName}
                        variant="standard"
                        onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="lastName"
                        label="Last Name"
                        value={client.lastName}
                        variant="standard"
                        onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="birthday"
                        label="Birthday"
                        type="date"
                        value={client.birthday}
                        variant="standard"
                        onChange={handleInputChange}
                        helperText="fecha de nacimiento"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="status"
                        label="Status"
                        select
                        value={client.status}
                        variant="standard"
                        onChange={handleInputChange}
                    >
                        <MenuItem value="espera">Espera</MenuItem>
                        <MenuItem value="validado">Validado</MenuItem>
                        <MenuItem value="rechazado">Rechazado</MenuItem>
                    </TextField>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            id="hasValidDocuments"
                            checked={client.hasValidDocuments}
                            onChange={handleInputChange}
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
                        onClick={handleUploadDocuments} >
                        Subir Documentos a Sistema
                    </Button>
                </FormControl>

                {/* Lista de documentos + descargar + eliminar*/}
            {/* Document Upload Section */}
            <FormControl fullWidth>
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>handleUploadDocuments(client.userId)}
                    disabled={!id || selectedFiles.length === 0}
                >
                    Upload Documents
                </Button>
            </FormControl>

            {/* File Preview Section */}
            {filePreview.length > 0 && (
                <div>
                    <h4>Selected Files:</h4>
                    {filePreview.map((file, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <img
                                src={file.preview}
                                alt={file.name}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    marginRight: '10px'
                                }}
                            />
                            <div>
                                <p>{file.name} ({Math.round(file.size / 1024)} KB)</p>
                            </div>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeFilePreview(index)}
                                startIcon={<DeleteIcon />}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}
                {/*startIcon={<DownloadIcon />}*/}
                <div>
                    <h4>Documents</h4>
                    {documents.length > 0 ? documents.map(doc => (
                        <div key={doc.id}>
                            <span>{doc.name}</span>
                            <Button onClick={() => downloadDocument(doc.id)} >
                                Descargar
                            </Button>
                            <Button onClick={() => openDocumentPreview(doc.id)}>
                                Vista Previa
                            </Button>
                            <Button onClick={() => deleteDocument(doc.id)}  color="error">
                                Eliminar
                            </Button>
                        </div>
                    )) : <p>No hay documentos disponibles.</p>}
                </div>
            {/* Document Preview Dialog */}
            <Dialog
                open={!!previewDocument}
                onClose={() => {
                    URL.revokeObjectURL(previewDocument);
                    setPreviewDocument(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Vista Previa del Documento</DialogTitle>
                <DialogContent>
                    {previewDocument && (
                        <iframe
                            src={previewDocument}
                            width="100%"
                            height="500px"
                            title="Document Preview"
                        />
                    )}
                </DialogContent>
            </Dialog>

                <FormControl>
                    <br />
                    <Button
                        type = "submit"
                        variant="contained"
                        color="info"
                        onClick={(e) => saveClient(e)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<SaveIcon />}
                    >
                        Grabar
                    </Button>
                </FormControl>
            <hr/>
            <Link to="/client/list">Back to List</Link>
        </Box>
    );
};

export default AddEditClient;