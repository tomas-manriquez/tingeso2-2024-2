import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import requestService from "../services/request.service.js";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import documentService from "../services/document.service.js";
import {Checkbox, FormControlLabel} from "@mui/material";
import IconButton from "@mui/material/IconButton";

const AddEditRequest = () => {
    const [clientRut, setClientRut] = useState("");
    const [type, setType] = useState("");
    const [maxPayTerm, setMaxPayTerm] = useState(0);
    const [annualInterest, setAnnualInterest] = useState(0.0);
    const [maxFinanceAmount, setMaxFinanceAmount] = useState(0.0);
    const [propertyValue, setPropertyValue] = useState(0);
    const [status, setStatus] = useState("");
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState(null);
    const [hasSufficientDocuments, setHasSufficientDocuments] = useState(true);
    const [monthlyCreditFee, setMonthlyCreditFee] = useState(0);
    const [monthlyClientIncome, setMonthlyClientIncome] = useState(0);
    const [hasGoodCreditHistory, setHasGoodCreditHistory] = useState(true);
    const [currentJobAntiquity, setCurrentJobAntiquity] = useState(0);
    const [isSelfEmployed, setIsSelfEmployed] = useState(false);
    const [monthlyDebt, setMonthlyDebt] = useState(0);
    const [bankAccountBalance, setBankAccountBalance] = useState(0);
    const [biggestWithdrawalInLastYear, setBiggestWithdrawalInLastYear]= useState(0);
    const [totalDepositsInLastYear, setTotalDepositsInLastYear] = useState(0);
    const [extraFees, setExtraFees] = useState([0]);
    const { id } = useParams();
    const [titleRequestForm, setTitleRequestForm] = useState("");
    const navigate = useNavigate();

    const saveRequest= (e) => {
        e.preventDefault();

        const request = { clientRut,
            type,
            maxPayTerm,
            annualInterest,
            maxFinanceAmount,
            propertyValue,
            status,
            documents,

            id };
        if (id) {
            //update data for Request
            requestService
                .update(request)
                .then((response) => {
                    console.log("Solicitud ha sido actualizada.", response.data);
                    navigate("/request/list");
                })
                .catch((error) => {
                    console.log(
                        "Ha ocurrido un error al intentar actualizar datos de Solicitud.",
                        error
                    );
                });
        } else {
            //Create New Extra Hour
            requestService
                .create(request)
                .then((response) => {
                    console.log("Hora Extra ha sido ingresada.", response.data);
                    navigate("/extraHours/list");
                })
                .catch((error) => {
                    console.log(
                        "Ha ocurrido un error al intentar crear nueva Hora Extra.",
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


    useEffect(() => {
        if (id) {
            setTitleRequestForm("Editar Solicitud");
            requestService
                .get(id)
                .then((extraHour) => {
                    setClientRut(extraHour.data.clientRut);
                    const formattedDate = new Date(extraHour.data.type).toISOString().split('T')[0];
                    setType(formattedDate);
                    setMaxPayTerm(extraHour.data.maxPayTerm);
                })
                .catch((error) => {
                    console.log("Se ha producido un error.", error);
                });
        } else {
            setTitleRequestForm("Nueva Solicitud");
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
            <h3> {titleRequestForm} </h3>
            <hr />
            <form>
                <FormControl fullWidth>
                    <TextField
                        id="clientRut"
                        label="Client Rut"
                        value={clientRut}
                        variant="standard"
                        onChange={(e) => setClientRut(e.target.value)}
                        helperText="Ej. 12.587.698-8"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="type"
                        label="Request Type"
                        type="type"
                        value={type}
                        variant="standard"
                        onChange={(e) => setType(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="maxPayTerm"
                        label="MaxPayTerm"
                        type="number"
                        value={maxPayTerm}
                        variant="standard"
                        onChange={(e) => setMaxPayTerm(e.target.valueAsNumber)}
                        helperText="Plazo Máximo"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="annualInterest"
                        label="AnnualInterest"
                        type="number"
                        value={annualInterest}
                        variant="standard"
                        onChange={(e) => setAnnualInterest(e.target.valueAsNumber)}
                        helperText="Interés Anual"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="maxFinanceAmount"
                        label="MaxFinanceAmount"
                        type="number"
                        value={maxFinanceAmount}
                        variant="standard"
                        onChange={(e) => setMaxFinanceAmount(e.target.valueAsNumber)}
                        helperText="Monto Máximo"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="propertyValue"
                        label="PropertyValue"
                        type="number"
                        value={propertyValue}
                        variant="standard"
                        onChange={(e) => setPropertyValue(e.target.valueAsNumber)}
                        helperText="Valor de la Propiedad"
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

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={hasSufficientDocuments}
                            onChange={(e) => setHasSufficientDocuments(e.target.checked)}
                        />
                    }
                    label="Has Sufficient Documents"
                />

                <FormControl fullWidth>
                    <TextField
                        id="monthlyCreditFee"
                        label="MonthlyCreditFee"
                        type="number"
                        value={monthlyCreditFee}
                        variant="standard"
                        onChange={(e) => setMonthlyCreditFee(e.target.valueAsNumber)}
                        helperText="Cuota Mensual"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="monthlyClientIncome"
                        label="MonthlyClientIncome"
                        type="number"
                        value={monthlyClientIncome}
                        variant="standard"
                        onChange={(e) => setMonthlyClientIncome(e.target.valueAsNumber)}
                        helperText="Ingresos Mensuales"
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={hasGoodCreditHistory}
                            onChange={(e) => setHasGoodCreditHistory(e.target.checked)}
                        />
                    }
                    label="Has Good Credit History"
                />

                <FormControl fullWidth>
                    <TextField
                        id="currentJobAntiquity"
                        label="CurrentJobAntiquity"
                        type="number"
                        value={currentJobAntiquity}
                        variant="standard"
                        onChange={(e) => setCurrentJobAntiquity(e.target.valueAsNumber)}
                        helperText="Antiguedad en trabajo actual (meses)"
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isSelfEmployed}
                            onChange={(e) => setIsSelfEmployed(e.target.checked)}
                        />
                    }
                    label="Is Self Employed"
                />

                <FormControl fullWidth>
                    <TextField
                        id="monthlyDebt"
                        label="MonthlyDebt"
                        type="number"
                        value={monthlyDebt}
                        variant="standard"
                        onChange={(e) => setMonthlyDebt(e.target.valueAsNumber)}
                        helperText="Monthly Debt"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="bankAccountBalance"
                        label="BankAccountBalance"
                        type="number"
                        value={bankAccountBalance}
                        variant="standard"
                        onChange={(e) => setBankAccountBalance(e.target.valueAsNumber)}
                        helperText="Monthly Debt"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="biggestWithdrawalInLastYear"
                        label="BiggestWithdrawalInLastYear"
                        type="number"
                        value={biggestWithdrawalInLastYear}
                        variant="standard"
                        onChange={(e) => setBiggestWithdrawalInLastYear(e.target.valueAsNumber)}
                        helperText="Retiro más grande de los últimos 12 meses"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="totalDepositsInLastYear"
                        label="TotalDepositsInLastYear"
                        type="number"
                        value={totalDepositsInLastYear}
                        variant="standard"
                        onChange={(e) => setTotalDepositsInLastYear(e.target.valueAsNumber)}
                        helperText="Total Deposits in Last Year"
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
                        onClick={(e) => saveRequest(e)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<SaveIcon />}
                    >
                        Grabar
                    </Button>
                </FormControl>
            </form>
            <hr />
            <Link to="/request/list">Back to List</Link>
        </Box>
    );
};

export default AddEditRequest;
