import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import requestService from "../services/request.service.js";

const SimulateCredit= () => {
    const [clientRut, setClientRut] = useState("");
    const [capital, setCapital] = useState("");
    const [interesAnual, setInteresAnual] = useState("");
    const [plazoPago, setPlazoPago] = useState("");
    const [e, setResult] = useState(0);
    const navigate = useNavigate();

    const simulateCredit = (e) => {
        e.preventDefault();
        console.log('Solicitar simular credito.');
        requestService
            .simulate(clientRut, capital, interesAnual, plazoPago)
            .then((response) => {
                console.log("simulacion aceptada", response.data);
                //navigate("/paycheck/list");
            })
            .catch((error) => {
                console.log(
                    "Ha ocurrido un error al intentar calcular la simulacion: ",
                    error
                );
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
        >
            <h3> Calcular Simulacion Credito </h3>
            <hr />
            <form>
                <FormControl fullWidth>
                    <TextField
                        select
                        id="clientRut"
                        label="ClientRut"
                        value={clientRut}
                        variant="standard"
                        onChange={(e) => setClientRut(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="capital"
                        label="Capital"
                        value={capital}
                        variant="standard"
                        onChange={(e) => setCapital(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="interesAnual"
                        label="InteresAnual"
                        value={interesAnual}
                        variant="standard"
                        onChange={(e) => setInteresAnual(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        id="plazoPago"
                        label="PlazoPago"
                        value={plazoPago}
                        select
                        variant="standard"
                        defaultValue="1"
                        onChange={(e) => setPlazoPago(e.target.value)}
                        style={{ width: "25%" }}
                    >

                    </TextField>
                </FormControl>

                <FormControl>
                    <br />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={(e) => simulateCredit(e)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<CalculateIcon />}
                    >
                        Calcular Simulacion
                    </Button>
                </FormControl>
            </form>
            <div>
                La cuota mensual del credito simulado es: {{e}}
            </div>
        </Box>
    );
};

export default SimulateCredit;
