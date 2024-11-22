import httpClient from "../http-common.js";

const getAll = () => {
    return httpClient.get('/api/requests/');
}

const create = data => {
    return httpClient.post("/api/requests/", data);
}

const get = id => {
    return httpClient.get(`/api/requests/${id}`);
}

const update = data => {
    return httpClient.put('/api/requests/update', data);
}

const remove = id => {
    return httpClient.delete(`/api/requests/${id}`);

}


const simulate = (clientRut, capital, interesAnual, plazoPago) => {
    return httpClient.get("/api/requests/calculate",{params:{clientRut, capital, interesAnual, plazoPago}});
}

const makeRequest = data =>
{
    return httpClient.post("/api/requests/makeRequest",data)
}

const evaluation = data =>
{
    return httpClient.put("/api/requests/evaluation",data)
}

const tracking = id =>
{
    return httpClient.get("/api/requests/status/${id}",id)
}
export default { getAll, create, get, update, remove, simulate, makeRequest, evaluation, tracking };
