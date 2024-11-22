import httpClient from "../http-common.js";

const simulation = (credit) =>{
    return httpClient.post('/simulation/', credit);
}

const example = () =>{
    return httpClient.get('/simulation/example')
}

export default { simulation, example };