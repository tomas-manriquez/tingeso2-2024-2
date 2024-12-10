import axios from "axios";

const tingesoBackendServer = VITE_PAYROLL_BACKEND_SERVER//import.meta.env.VITE_PAYROLL_BACKEND_SERVER;
const tingesoBackendPort = VITE_PAYROLL_BACKEND_PORT//import.meta.env.VITE_PAYROLL_BACKEND_PORT;

console.log(tingesoBackendServer)
console.log(tingesoBackendPort)

export default axios.create({
    baseURL: `http://${tingesoBackendServer}:${tingesoBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});