import httpClient from "../http-common.js";

const example = () =>{
    return httpClient.get('/total-cost-calc/example');
}

const totalCostCalculation = (credit) =>{
    return httpClient.post('total-cost-calc/calc',credit);
}

export default {example, totalCostCalculation};