import httpClient from "../http-common.js";

const example = () =>{
    return httpClient.get('/track-request/example');
}

const trackRequest = (id) =>{
    return httpClient.get(`/track-request/${id}`);
}

export default {example, trackRequest};