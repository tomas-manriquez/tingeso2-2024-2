import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CreditRequestService from "../services/m3-solicitud-credito.service.js";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import {Checkbox, FormControlLabel, InputLabel, Select} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import creditsRequestService from "../services/m3-solicitud-credito.service.js";
import UserRegisterService from "../services/actual-registro-usuario.service.js";

const AddEditRequest = () => {
    const [finEval, setFinEval] = useState({
        finEvaId:null,
        userId:null,
        status:'',
        documentsIds: [],
        hasSufficientDocuments:false,
        monthlyCreditFee:0,
        monthlyClientIncome:0,
        hasGoodCreditHistory:false,
        currentJobAntiquity:0,
        isSelfEmployed:false,
        hasGoodIncomeHistory:false,
        monthlyDebt:0,
        bankAccountBalance:0,
        biggestWithdrawalInLastYear:0,
        bankAccountAge:0,
        biggestWithdrawalInLastSemester:0
    });
    const [credits, setCredit] = useState({
        creditsId:null,
        finEvalId:null,
        type:'',
        maxPayTerm:0,
        annualInterestRate:0.0,
        maxFinanceAmount:0,
        propertyValue:0,
        requestedAmount:0,
        totalFees:[]
    });
    const [request, setRequest] = useState({
        finEval:{
            finEvaId:null,
            userId:null,
            status:'E1',
            documentsIds: [],
            hasSufficientDocuments:false,
            monthlyCreditFee:0,
            monthlyClientIncome:0,
            hasGoodCreditHistory:false,
            currentJobAntiquity:0,
            isSelfEmployed:false,
            hasGoodIncomeHistory:false,
            monthlyDebt:0,
            bankAccountBalance:0,
            biggestWithdrawalInLastYear:0,
            bankAccountAge:0,
            biggestWithdrawalInLastSemester:0
        },
        credits:{
            creditsId:null,
            finEvalId:null,
            type:'',
            maxPayTerm:0,
            annualInterestRate:0.0,
            maxFinanceAmount:0,
            propertyValue:0,
            requestedAmount:0,
            totalFees:[]
        },
    });
    const [extraFees, setExtraFees] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState(null);
    const { id } = useParams();
    const [titleRequestForm, setTitleRequestForm] = useState("");
    const navigate = useNavigate();

    const saveRequest= (e) => {
        e.preventDefault(); // Prevent form submission

        // Check if `id` is available (editing an existing client)
        if (id) {
            // Update Client
            CreditRequestService
                .createFinEvalWithCredits(request) // Call the update service
                .then((response) => {
                    console.log("Request + credits has been updated successfully:", response.data);
                    navigate("/request/list"); // Navigate back to the client list
                })
                .catch((error) => {
                    console.error(
                        "An error occurred while updating the client:",
                        error
                    );
                });
        } else {
            // Create a New Client
            const newClient = { ...request, id: null }; // Ensure `id` is null for new clients
            CreditRequestService
                .createFinEvalWithCredits(newClient) // Call the register service
                .then((response) => {
                    console.log("Request + credits has been added successfully:", response.data);
                    navigate("/request/list"); // Navigate back to the client list
                })
                .catch((error) => {
                    console.error(
                        "An error occurred while creating a new Request + credits:",
                        error
                    );
                });
        }
    };

    const uploadMultipleFinancialEvaluationDocuments = async (files) => {
        try {
            // Create an array to store document IDs
            const documentPromises = files.map(file =>
                creditsRequestService.uploadUserDocument(file, id)
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
            await uploadMultipleFinancialEvaluationDocuments(selectedFiles, id);

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
        creditsRequestService.getDocument(documentId)
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
            creditsRequestService.remove(documentId).then(() => {
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
        console.log("Sending document IDs to backend:", finEval.documentsIds);
        try {
            const response = await creditsRequestService.getAllDocuments(finEval.documentsIds); // Pass user ID to the service method
            const clientDocuments = response.data;
            setDocuments(clientDocuments);
        } catch (error) {
            console.log("Error fetching documents:", error);
        }
    };

    const addExtraFee = () => {
        setExtraFees([...extraFees, 0]); //agrega valor inicializado a 0
    };

    const removeExtraFee = (index) => {
        setExtraFees(extraFees.filter((_, i) => i !== index)); //borra en indice dado
    };

    const handleExtraFeeChange = (index, value) => {
        const updatedFees = [...extraFees];
        updatedFees[index] = parseFloat(value);
        setExtraFees(updatedFees);
    };


    const init = () => {
        if (id) {
            setTitleRequestForm("Editar Solicitud");
            CreditRequestService.getCreditRequestWithCreditDTO(id).then((response) => {
                const request = response.data;
                //setFinEval(financialEvaluation);
                //setCredit(credits);
                setRequest(request);
            }).catch((error) => {
                console.error("Error fetching request data:", error);
                alert("Failed to load request data. Please try again.");
            });
        } else {
            setTitleRequestForm("Nueva Solicitud");
        }
    };

    useEffect(() => {
        init();
    }, [request,finEval,credits]);

    useEffect(() => {
       console.log(request);
    }, [request,finEval,credits]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={saveRequest}
        >
            <h3> {titleRequestForm} </h3>
            <hr />
                <FormControl fullWidth>
                    <InputLabel id="status-label">Tipo de Crédito</InputLabel>
                    <Select
                        id="type"
                        labelId="Tipo de Crédito"
                        value={request.type || ''}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.credits,
                                type: e.target.value
                            }
                        })}
                    >
                        <MenuItem value="propiedad1">para Primera Vivienda</MenuItem>
                        <MenuItem value="propiedad2">para Segunda Vivienda</MenuItem>
                        <MenuItem value="comercial">para Propiedades Comerciales</MenuItem>
                        <MenuItem value="remodelacion">para Remodelación</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Select
                        id="type"
                        label="Request Type"
                        type="type"
                        value={request.status}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            finEval: {
                                ...request.finEval,
                                status: e.target.value
                            }
                        })}
                    >
                        <MenuItem value="E1">E1. En Revisión Inicial</MenuItem>
                        <MenuItem value="E2">E2. Pendiente de Documentación.</MenuItem>
                        <MenuItem value="E3">E3. En Evaluación.</MenuItem>
                        <MenuItem value="E4">E4. Pre-Aprobada.</MenuItem>
                        <MenuItem value="E5">E5. En Aprobación Final.</MenuItem>
                        <MenuItem value="E6">E6. Aprobada.</MenuItem>
                        <MenuItem value="E7">E7. Rechazada.</MenuItem>
                        <MenuItem value="E8">E8. Cancelada por el Cliente.</MenuItem>
                        <MenuItem value="E9">E9. En Desembolso.</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="maxPayTerm"
                        label="MaxPayTerm"
                        type="number"
                        value={request.maxPayTerm}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.maxPayTerm,
                                type: e.target.valueAsNumber
                            }
                        })}
                        helperText="Plazo Máximo"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="annualInterest"
                        label="AnnualInterest"
                        type="number"
                        value={request.annualInterestRate}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.annualInterestRate,
                                type: e.target.valueAsNumber
                            }
                        })}
                        helperText="Interés Anual"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="maxFinanceAmount"
                        label="MaxFinanceAmount"
                        type="number"
                        value={request.maxFinanceAmount}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.maxFinanceAmount,
                                type: e.target.valueAsNumber
                            }
                        })}
                        helperText="Monto Máximo"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="propertyValue"
                        label="PropertyValue"
                        type="number"
                        value={request.propertyValue}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.propertyValue,
                                type: e.target.valueAsNumber
                            }
                        })}
                        helperText="Valor de la Propiedad"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="requestedAmount"
                        label="RequestedAmount"
                        type="number"
                        value={request.requestedAmount}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            credits: {
                                ...request.requestedAmount,
                                type: e.target.valueAsNumber
                            }
                        })}
                    >
                        <MenuItem value="vivienda1">para Primera Vivienda</MenuItem>
                        <MenuItem value="vivienda2">para Segunda Vivienda</MenuItem>
                        <MenuItem value="comercial">para Propiedades Comerciales</MenuItem>
                        <MenuItem value="remodelacion">para Remodelación</MenuItem>
                    </TextField>
                </FormControl>

                {/* Subir documento */}
                <FormControl fullWidth>
                    <input type="file" onChange={(e) => setNewDocument(e.target.files[0])} />
                    {/*startIcon={<UploadIcon />}*/}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUploadDocuments} >
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

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={request.hasSufficientDocuments}
                            onChange={(e) => setRequest({
                                ...request,
                                finEval: {
                                    ...request.hasSufficientDocuments,
                                    type: e.target.checked
                                }
                            })}
                        />
                    }
                    label="Has Sufficient Documents"
                />

                <FormControl fullWidth>
                    <TextField
                        id="monthlyCreditFee"
                        label="Monthly Credit Fee"
                        type="number"
                        value={request.monthlyCreditFee}
                        variant="standard"
                        onChange={(e) => setRequest({
                            ...request,
                            finEval: {
                                ...request.finEval,
                                monthlyCreditFee: e.target.valueAsNumber
                            }
                        })}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="monthlyClientIncome"
                        label="MonthlyClientIncome"
                        type="number"
                        value={request.monthlyClientIncome}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                monthlyClientIncome: e.target.valueAsNumber
                            }
                        })}
                        helperText="Ingresos Mensuales"
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={request.hasGoodCreditHistory}
                            onChange={(e) => setRequest({
                                ...request,
                                finEval: {
                                    ...request.hasGoodCreditHistory,
                                    type: e.target.checked
                                }
                            })}
                        />
                    }
                    label="Has Good Credit History?"
                />

                <FormControl fullWidth>
                    <TextField
                        id="currentJobAntiquity"
                        label="CurrentJobAntiquity"
                        type="number"
                        value={request.currentJobAntiquity}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                currentJobAntiquity: e.target.valueAsNumber
                            }
                        })}
                        helperText="Antiguedad en trabajo actual (meses)"
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={request.isSelfEmployed}
                            onChange={(e) => setRequest({
                                ...request,
                                finEval: {
                                    ...request.isSelfEmployed,
                                    type: e.target.checked
                                }
                            })}
                        />
                    }
                    label="Is Self Employed?"
                />

                <FormControl fullWidth>
                    <TextField
                        id="monthlyDebt"
                        label="MonthlyDebt"
                        type="number"
                        value={request.monthlyDebt}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                monthlyDebt: e.target.valueAsNumber
                            }
                        })}
                        helperText="Monthly Debt"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="bankAccountBalance"
                        label="BankAccountBalance"
                        type="number"
                        value={request.bankAccountBalance}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                bankAccountBalance: e.target.valueAsNumber
                            }
                        })}
                        helperText="Bank Account Balance"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="bankAccountAge"
                        label="BankAccountAge"
                        type="number"
                        value={request.bankAccountAge}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                bankAccountAge: e.target.valueAsNumber
                            }
                        })}
                        helperText="Bank Account Age"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="biggestWithdrawalInLastYear"
                        label="BiggestWithdrawalInLastYear"
                        type="number"
                        value={request.biggestWithdrawalInLastYear}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                biggestWithdrawalInLastYear: e.target.valueAsNumber
                            }
                        })}
                        helperText="Retiro más grande de los últimos 12 meses"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="biggestWithdrawalInLastSemester"
                        label="BiggestWithdrawalInLastSemester"
                        type="number"
                        value={request.biggestWithdrawalInLastSemester}
                        variant="standard"
                        onChange={(e) => setRequest( {
                            ...request,
                            finEval: {
                                ...request.finEval,
                                biggestWithdrawalInLastSemester: e.target.valueAsNumber
                            }
                        })}
                        helperText="Retiro más grande de los últimos 12 meses"
                    />
                </FormControl>

                <h4>Extra Fees:</h4>
                {extraFees.map((fee, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                        <TextField
                            label={`Extra Fee ${index + 1}`}
                            type="number"
                            value={fee}
                            onChange={(e) => handleExtraFeeChange(index, e.target.value)}
                            variant="standard"
                            inputProps={{ step: "0.01" }} // Allows decimal input
                            style={{ width: "150px", marginRight: "8px" }}
                        />
                        <IconButton onClick={() => removeExtraFee(index)} color="error">
                            Delete
                        </IconButton>
                    </Box>
                ))}
                <Button variant="outlined" onClick={addExtraFee}>
                    Add Extra Fee
                </Button>


                <FormControl>
                    <br />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={saveRequest}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<SaveIcon />}
                    >
                        Grabar
                    </Button>
                </FormControl>
            <hr />
            <Link to="/request/list">Back to List</Link>
        </Box>
    );
};

export default AddEditRequest;
