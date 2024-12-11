import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    FormControl,
    TextField,
    Button,
    MenuItem,
    Checkbox,
    FormControlLabel, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

// Placeholder service - you'll need to create this
import FinEvalService from '../services/m3-solicitud-credito.service.js';
import CreditRequestService from '../services/m3-solicitud-credito.service.js';
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import UserRegisterService from "../services/actual-registro-usuario.service.js";

const AddEditFinEval = () => {
    const { id } = useParams();
    const [finEval, setFinEval] = useState({
        finEvalId: id,
        userId: null,
        status: '',
        documentsIds: [],
        hasSufficientDocuments: false,
        monthlyCreditFee: null,
        monthlyClientIncome: null,
        hasGoodCreditHistory: false,
        currentJobAntiquity: null,
        isSelfEmployed: false,
        hasGoodIncomeHistory: false,
        monthlyDebt: null,
        bankAccountBalance: null,
        biggestWithdrawalInLastYear: null,
        totalDepositsInLastYear: null,
        bankAccountAge: null,
        biggestWithdrawalInLastSemester: null
    });
    const[credit, setCredit] = useState({
        creditId: null,
        finEvalId: finEval.finEvalId,
        type: "propiedad1",
        maxPayTerm: null,
        annualInterestRate: null,
        maxFinanceAmount: null,
        propertyValue: null,
        requestedAmount: null,
        totalFees: []
    })
    const [documents, setDocuments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreview, setFilePreview] = useState([]);
    const [previewDocument, setPreviewDocument] = useState(null);

    const navigate = useNavigate();
    const [titleFinEvalForm, setTitleFinEvalForm] = useState("Nueva Evaluación Financiera");

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, id, value, type, checked } = e.target;

        // Use name or id to determine which field is being changed
        const fieldName = name || id;

        setFinEval(prevFinEval => ({
            ...prevFinEval,
            [fieldName]: type === 'checkbox' ? checked :
                type === 'number' ? value : ''
        }));

    };

    const handleCreditInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setCredit(prevCredit => ({
            ...prevCredit,
            [name]: type === 'checkbox' ? checked :
                type === 'number' ? (
                    value === '' ? null :
                        name === 'annualInterestRate' ? parseFloat(value) :
                            Number(value)
                ) : value
        }));
    };

    // Add a new fee to the list
    const addFee = (fee) => {
        setCredit(prevCredit => ({
            ...prevCredit,
            totalFees: [...prevCredit.totalFees, Number(fee)]
        }));
    };

// Remove a fee by its index
    const removeFee = (indexToRemove) => {
        setCredit(prevCredit => ({
            ...prevCredit,
            totalFees: prevCredit.totalFees.filter((_, index) => index !== indexToRemove)
        }));
    };

// Update a specific fee by its index
    const updateFee = (index, newValue) => {
        setCredit(prevCredit => {
            const updatedFees = [...prevCredit.totalFees];
            updatedFees[index] = Number(newValue);
            return {
                ...prevCredit,
                totalFees: updatedFees
            };
        });
    };

// Render method to show and modify fees
    const renderFeesInput = () => {
        return (
            <Box>
                <Typography variant="h6">Total Fees</Typography>
                {credit.totalFees.map((fee, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                            type="number"
                            label={`Fee ${index + 1}`}
                            value={fee}
                            onChange={(e) => updateFee(index, e.target.value)}
                            variant="standard"
                            fullWidth
                        />
                        <Button
                            color="secondary"
                            onClick={() => removeFee(index)}
                        >
                            Remove
                        </Button>
                    </Box>
                ))}
                <Button
                    variant="contained"
                    onClick={() => addFee(0)}
                    color="primary"
                >
                    Add Fee
                </Button>
            </Box>
        );
    };

    // Save or update financial evaluation
    const saveFinEval = async (e) => {
        e.preventDefault();

        // Prepare the credit object with the linked finEvalId
        const updatedCredit = {
            ...credit,
            finEvalId: finEval.finEvalId, // Ensure the link between finEval and credit
        };

        const request = {
            finEval: finEval,
            credits: updatedCredit, // Use the updated credit object
        };

        try {
            if (!finEval.finEvalId || !credit.finEvalId || finEval.finEvalId !== credit.finEvalId) {
                // Create a new financial evaluation + credit object
                const response = await FinEvalService.createFinEvalWithCredits(request);
                console.log("Financial Evaluation + Credit created successfully:", response.data);
            } else {
                // Update existing financial evaluation + credit object
                const response = await FinEvalService.createFinEvalWithCredits(request);
                console.log("Financial Evaluation + Credit updated successfully:", response.data);
            }
            navigate("/request/list");
        } catch (error) {
            console.error("Error saving financial evaluation:", error);
            alert("An error occurred while saving the financial evaluation. Please try again.");
        }
    };


    //DOCUMENT
    // Document-related functions (copied from AddEditClient)
    const uploadMultipleUserDocuments = async (files) => {
        try {
            // Ensure finEvalId exists before uploading
            if (!finEval.finEvalId) {
                alert("Please save the financial evaluation first before uploading documents.");
                return [];
            }

            // Upload each file and collect their IDs
            const documentPromises = files.map(file =>
                CreditRequestService.uploadFinancialEvaluationDocument(file, finEval.finEvalId)
            );

            const uploadedDocuments = await Promise.all(documentPromises);
            console.log("Raw uploaded documents:", uploadedDocuments);
            const documentIds = uploadedDocuments.map(doc => doc.data.id);

            // Merge new document IDs with the existing ones
            const updatedDocumentsIds = [...(finEval.documentsIds || []), ...documentIds];

            // Update finEval state asynchronously
            setFinEval(prevFinEval => ({
                ...prevFinEval,
                documentsIds: updatedDocumentsIds,
            }));

            // Save finEval with updated state
            await FinEvalService.saveFinEval({
                ...finEval,
                documentsIds: updatedDocumentsIds,
            });


            return documentIds;
        } catch (error) {
            console.error("Error uploading multiple documents:", error);
            alert("Error uploading documents. Please try again.");
            return [];
        }
    };

    // Handle file selection for preview and upload
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        const previews = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file)
        }));
        setFilePreview(previews);
    };

    // Trigger document upload
    const handleUploadDocuments = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        try {
            await uploadMultipleUserDocuments(selectedFiles);
            await fetchDocuments();

            // Clear selected files and previews
            setSelectedFiles([]);
            setFilePreview([]);

            alert("Documents uploaded successfully!");
        } catch (error) {
            console.error("Error in document upload:", error);
        }
    };


    const fetchDocuments = async () => {
        if (!id) {
            console.error("Financial Evaluation ID is missing. Unable to fetch documents.");
            return;
        }

        // Check if documentsIds exists and is not empty
        if (!finEval.documentsIds || finEval.documentsIds.length === 0) {
            console.log("No documents to fetch.");
            setDocuments([]);
            return;
        }

        try {
            // Ensure you're passing the documentIds array correctly
            const response = await CreditRequestService.getAllDocuments(finEval.documentsIds);

            // Log the response to understand its structure
            console.log("Document fetch response:", response);

            // Adjust based on the actual response structure
            setDocuments(response.data || response);
        } catch (error) {
            console.error("Error fetching documents:", error);
            setDocuments([]); // Ensure documents state is cleared on error
        }
    };

    // Preview a document
    const openDocumentPreview = (documentId) => {
        CreditRequestService.getDocument(documentId)
            .then((response) => {
                const blob = new Blob([response.data], {
                    type: response.headers['content-type'] || 'application/octet-stream'
                });
                const url = URL.createObjectURL(blob);
                setPreviewDocument(url);
            })
            .catch((error) => {
                console.log("Error previewing the document.", error);
                alert("Could not preview the document.");
            });
    };

    // Download a document
    const downloadDocument = (documentId) => {
        CreditRequestService.getDocument(documentId)
            .then((response) => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

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
                console.log("Error downloading the document.", error);
            });
    };

    // Delete a document
    const deleteDocument = (documentId) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            CreditRequestService.remove(documentId)
                .then(() => {
                    // Remove the document ID from finEval
                    setFinEval(prevFinEval => ({
                        ...prevFinEval,
                        documentsIds: prevFinEval.documentsIds.filter(id => id !== documentId)
                    }));
                    fetchDocuments();
                })
                .catch((error) => {
                    console.log("Error deleting the document.", error);
                });
        }
    };

    // Render method to show document upload and list
    const renderDocumentUpload = () => {
        return (
            <Box>
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                />
                {filePreview.length > 0 && (
                    <Box>
                        <Typography>Selected Files:</Typography>
                        {filePreview.map((file, index) => (
                            <Typography key={index}>
                                {file.name} - {file.size} bytes
                            </Typography>
                        ))}
                        <Button
                            variant="contained"
                            onClick={handleUploadDocuments}
                        >
                            Upload Documents
                        </Button>
                    </Box>
                )}

                {documents.length > 0 && (
                    <Box>
                        <Typography variant="h6">Uploaded Documents</Typography>
                        {documents.map((doc) => (
                            <Box key={doc.id}>
                                <Typography>{doc.name}</Typography>
                                <Button onClick={() => openDocumentPreview(doc.id)}>
                                    Preview
                                </Button>
                                <Button onClick={() => downloadDocument(doc.id)}>
                                    Download
                                </Button>
                                <Button onClick={() => deleteDocument(doc.id)}>
                                    Delete
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}

                {previewDocument && (
                    <Dialog open={!!previewDocument} onClose={() => setPreviewDocument(null)}>
                        <DialogContent>
                            <iframe
                                src={previewDocument}
                                width="100%"
                                height="500px"
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </Box>
        );
    };
    //DOCUMENT

    // Fetch existing financial evaluation when editing
    useEffect(() => {
        if (id) {
            setTitleFinEvalForm("Editar Evaluación Financiera");
            FinEvalService.getCreditRequestWithCreditDTO(id)
                .then((response) => {
                    const finEvalData = response.data.finEval;
                    setFinEval({
                        ...finEvalData
                    });
                    const creditData = response.data.credits;
                    setCredit({
                        ...creditData
                    })
                })
                .catch((error) => {
                    console.error("Error fetching financial evaluation:", error);
                });
        }
    }, [id]);


// You might want to call this in a useEffect
    useEffect(() => {
        if (id) {
            fetchDocuments();
        }
    }, [id, finEval.documentsIds]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={saveFinEval}
        >
            <h3>{titleFinEvalForm}</h3>
            <hr/>

            {/* User ID Input */}
            <FormControl fullWidth>
                <TextField
                    id="userId"
                    label="User ID"
                    type="number"
                    value={finEval.userId ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            {/* Status Dropdown */}
            <FormControl fullWidth>
                <TextField
                    name="status"
                    label="Status"
                    select
                    value={finEval.status}
                    variant="standard"
                    onChange={handleInputChange}
                >
                    <MenuItem value="E1">E1. En Revisión Inicial.</MenuItem>
                    <MenuItem value="E2">E2. Pendiente de Documentación.</MenuItem>
                    <MenuItem value="E3">E3. En Evaluación.</MenuItem>
                    <MenuItem value="E4">E4. Pre-Aprobada.</MenuItem>
                    <MenuItem value="E5">E5. En Aprobación Final.</MenuItem>
                    <MenuItem value="E6">E6. Aprobada.</MenuItem>
                    <MenuItem value="E7">E7. Rechazada.</MenuItem>
                    <MenuItem value="E8">E8. Cancelada por el Cliente.</MenuItem>
                    <MenuItem value="E9">E9. En Desembolso.</MenuItem>
                </TextField>
            </FormControl>

            {/* Numeric Inputs */}
            <FormControl fullWidth>
                <TextField
                    id="monthlyCreditFee"
                    label="Monthly Credit Fee"
                    type="number"
                    value={finEval.monthlyCreditFee || ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="monthlyClientIncome"
                    label="Monthly Client Income"
                    type="number"
                    value={finEval.monthlyClientIncome ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="currentJobAntiquity"
                    label="Current Job Antiquity"
                    type="number"
                    value={finEval.currentJobAntiquity ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="monthlyDebt"
                    label="Monthly Debt"
                    type="number"
                    value={finEval.monthlyDebt ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="bankAccountBalance"
                    label="Bank Account Balance"
                    type="number"
                    value={finEval.bankAccountBalance ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="biggestWithdrawalInLastYear"
                    label="biggest Withdrawal In Last Year"
                    type="number"
                    value={finEval.biggestWithdrawalInLastYear ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="totalDepositsInLastYear"
                    label="Total Deposits In Last Year"
                    type="number"
                    value={finEval.totalDepositsInLastYear ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="bankAccountAge"
                    label="Bank Account Age"
                    type="number"
                    value={finEval.bankAccountAge ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="biggestWithdrawalInLastSemester"
                    label="biggest Withdrawal In Last Semester"
                    type="number"
                    value={finEval.biggestWithdrawalInLastSemester ?? ''}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            {/* Checkbox Inputs */}
            <FormControlLabel
                control={
                    <Checkbox
                        id="hasSufficientDocuments"
                        checked={finEval.hasSufficientDocuments}
                        onChange={handleInputChange}
                    />
                }
                label="Has Sufficient Documents"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        id="hasGoodCreditHistory"
                        checked={finEval.hasGoodCreditHistory}
                        onChange={handleInputChange}
                    />
                }
                label="Has Good Credit History"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        id="isSelfEmployed"
                        checked={finEval.isSelfEmployed}
                        onChange={handleInputChange}
                    />
                }
                label="Is Self Employed"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        id="hasGoodIncomeHistory"
                        checked={finEval.hasGoodIncomeHistory}
                        onChange={handleInputChange}
                    />
                }
                label="Has Good Income History"
            />


            {/* CREDIT */}

            {/* Status Dropdown */}
            <FormControl fullWidth>
                <TextField
                    name="type"
                    label="Credit Type"
                    select
                    value={credit.type || ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                >
                    <MenuItem value="propiedad1">para Primera Vivienda</MenuItem>
                    <MenuItem value="propiedad2">para Segunda Vivienda</MenuItem>
                    <MenuItem value="comercial">para Propiedades Comerciales</MenuItem>
                    <MenuItem value="remodelacion">para Remodelación</MenuItem>
                </TextField>
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    name="maxPayTerm"
                    label="Maximum Pay Term"
                    type="number"
                    value={credit.maxPayTerm ?? ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    name="annualInterestRate"
                    label="Annual Interest Rate"
                    type="number"
                    step="0.01"  // Allows decimal input
                    value={credit.annualInterestRate ?? ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    name="maxFinanceAmount"
                    label="Maximum Finance Amount"
                    type="number"
                    step="0.01"  // Allows decimal input
                    value={credit.maxFinanceAmount ?? ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    name="propertyValue"
                    label="Property Value"
                    type="number"
                    value={credit.propertyValue ?? ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    name="requestedAmount"
                    label="Requested Amount"
                    type="number"
                    value={credit.requestedAmount ?? ''}
                    variant="standard"
                    onChange={handleCreditInputChange}
                />
            </FormControl>

            {renderFeesInput()}

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
                    onClick={() =>handleUploadDocuments(finEval.finEvalId)}
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
            {/*renderDocumentUpload()*/}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    startIcon={<SaveIcon />}
                >
                    Save
                </Button>
            </FormControl>

            <hr/>
            <Link to="/request/list">Back to List</Link>
        </Box>
    );
};

export default AddEditFinEval;