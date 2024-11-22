import axios from "axios";

const tingesoBackendServer = import.meta.env.VITE_PAYROLL_BACKEND_SERVER;
const tingesoBackendPort = import.meta.env.VITE_PAYROLL_BACKEND_PORT;

console.log(tingesoBackendServer)
console.log(tingesoBackendPort)

export default axios.create({
    baseURL: `http://${tingesoBackendServer}:${tingesoBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});