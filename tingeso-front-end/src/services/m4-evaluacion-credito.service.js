import httpClient from "../http-common.js";

const example = () =>{
    return httpClient.get('credit-eval/example');
}

const requestEvaluation = (id) =>{
    return httpClient.post(`/credit-eval/${id}`)
}

export default {example, requestEvaluation};