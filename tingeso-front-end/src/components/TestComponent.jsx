import React, { useState } from "react";
import userService from "../services/m2-registro-usuario.service";

const TestComponent = () => {
    const [simulationData, setSimulationData] = useState(null);
    const [exampleData, setExampleData] = useState(null);
    const [error, setError] = useState(null);

    const credit= {
        "finEvalId":1,
        "type":"propiedad1",
        "maxPayTerm":30,
        "annualInterestRate":3.5,
        "maxFinanceAmount":0.8,
        "propertyValue":150000000,
        "requestedAmount": 120000000,
        "totalFees":[0.1,2]
    };

    const testSimulation = async () => {
        try {
            const data = await userService.simulation(credit);
            setSimulationData(data);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError("Failed to fetch simulation data.");
            console.error(err);
        }
    };

    const testExample = async () => {
        try {
            const data = await userService.example();
            setExampleData(data);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError("Failed to fetch example data.");
            console.error(err);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Service Function Tester</h1>
            <button onClick={testSimulation} style={{ marginRight: "10px" }}>
                Test Simulation
            </button>
            <button onClick={testExample}>Test Example</button>

            {simulationData && (
                <div>
                    <h2>Simulation Data:</h2>
                    <pre>{JSON.stringify(simulationData, null, 2)}</pre>
                </div>
            )}

            {exampleData && (
                <div>
                    <h2>Example Data:</h2>
                    <pre>{JSON.stringify(exampleData, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default TestComponent;
