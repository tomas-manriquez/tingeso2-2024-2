import httpClient from "../http-common.js";

const getAll = () => {
    return httpClient.get('/api/documents/');
}

const create = data => {
    return httpClient.post("/api/documents/", data);
}

const get = id => {
    return httpClient.get(`/api/documents/${id}`);
}

const update = data => {
    return httpClient.put('/api/documents/update', data);
}

const remove = id => {
    return httpClient.delete(`/api/documents/${id}`);
}

const download = id => {
    return httpClient.get(`/api/documents/download/${id}`,
        { responseType: 'blob' }); //descarga de Binary Large Object
}

const upload = (file, clientId, requestId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientId", clientId);
    formData.append("requestId", requestId);

    return httpClient.post("/api/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export default { getAll, create, get, update, remove, download, upload };
