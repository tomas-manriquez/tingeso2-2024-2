import httpClient from "../http-common.js";

const example = () =>{
    return httpClient.get('/register/example');
}

const register = (user) =>{
    return httpClient.post('/register/', user);
}

const findById = (id) => {
    return httpClient.get(`/register/${id}`);
}

const findAll = () =>{
    return httpClient.get('/register/all');
}

const remove = (user) =>{
    return httpClient.delete('register/delete', {data: user});
}

const save = (user) =>{
    return httpClient.post('register/save',user)
}

export default { example, register, findById, findAll, remove, save};