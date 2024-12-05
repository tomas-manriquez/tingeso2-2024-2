import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CreditSimulationService from "../services/m2-registro-usuario.service.js";
import MenuItem from "@mui/material/MenuItem";

const SimulateCredit= () => {
    const [clientRut, setClientRut] = useState("");
    const [credit, setCredit] = useState({
        type: "",
        maxPayTerm: "",
        annualInterestRate: "",
        maxFinanceAmount: "",
        propertyValue: "",
        requestedAmount: "",
        clientRut: ""
    });
    const [simulationResult, setSimulationResult] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCredit(prevCredit => ({
            ...prevCredit,
            [id]: value
        }));
    };

    const simulateCredit = (e) => {
        e.preventDefault();
        CreditSimulationService
            .simulation(credit)
            .then((response) => {
                console.log("simulacion aceptada", response.data);
                setSimulationResult(response.data);
            })
            .catch((error) => {
                console.log(
                    "Ha ocurrido un error al intentar calcular la simulacion: ",
                    error
                );
                setSimulationResult(null);
            });
        console.log("Fin calculo simulacion");
    };


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={simulateCredit}
        >
            <h3>Calcular Simulacion Credito</h3>
            <hr />

            <FormControl fullWidth>
                <TextField
                    select
                    id="type"
                    label="Tipo de Credito"
                    value={credit.type}
                    variant="standard"
                    onChange={handleInputChange}
                >
                    <MenuItem value="vivienda1">Credito para 1ra Vivienda</MenuItem>
                    <MenuItem value="vivienda2">Credito para 2da Vivienda</MenuItem>
                    <MenuItem value="comercial">Credito para Propiedad Comercial</MenuItem>
                    <MenuItem value="remodelacion">Credito para Remodelacion</MenuItem>
                </TextField>
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="maxPayTerm"
                    label="Plazo Maximo (Años)"
                    type="number"
                    value={credit.maxPayTerm}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="annualInterestRate"
                    label="Tasa de Interes Anual (%)"
                    type="number"
                    value={credit.annualInterestRate}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="maxFinanceAmount"
                    label="Porcentaje Maximo Financiamiento"
                    type="number"
                    value={credit.maxFinanceAmount}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="propertyValue"
                    label="Valor Propiedad (CLP)"
                    type="number"
                    value={credit.propertyValue}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="requestedAmount"
                    label="Monto Solicitado (CLP)"
                    type="number"
                    value={credit.requestedAmount}
                    variant="standard"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    style={{ marginTop: "1rem" }}
                    startIcon={<CalculateIcon />}
                >
                    Calcular Simulacion
                </Button>
            </FormControl>

            {simulationResult && (
                <div style={{ marginTop: "1rem" }}>
                    <h4>Resultado de Simulación</h4>
                    <p>La cuota mensual del credito simulado es: {simulationResult}</p>
                </div>
            )}
        </Box>
    );
};

export default SimulateCredit;
