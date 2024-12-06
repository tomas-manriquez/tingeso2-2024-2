import httpClient from "../http-common.js";

//FinEval
const example = () =>{
    return httpClient.get('credit-request/example');
}

const makeRequest = (id, credit) =>{
    return httpClient.post(`/credit-request/make/${id}`, credit);
}

const findById = (id) =>{
    return httpClient.get(`/credit-request/${id}`);
}

const findAll = () =>{
    return httpClient.get('credit-request/all');
}

const saveFinEval = (finEval) =>{
    return httpClient.post('credit-request/save', finEval);
}

const saveCredit = (credit) =>{
    return httpClient.post('/credit-request/credit', credit);
}

const getAllCreditRequestsWithCredits = () =>{
    return httpClient.get('credit-request/all/w-creds');
}

const getCreditRequestWithCreditDTO = (id) =>{
    return httpClient.get(`/credit-request/${id}/w-creds`);
}

//'save' method in backend
const createFinEvalWithCredits = (dto) =>{
    return httpClient.post("/credit-request/save/w-creds", dto);
}

//Document
const uploadFinancialEvaluationDocument = async (file, finEvalId) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.post(`/credit-request/doc/upload/${finEvalId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


/**
 * Upload a document to the backend service
 * @param {File} file - The file to be uploaded
 * @param {Object} options - Optional parameters for the upload
 * @param {number} [options.userId] - Optional user ID
 * @param {number} [options.finEvalId] - Optional financial evaluation ID
 */
export const uploadDocument = async (file, options = {}) => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Add optional parameters if provided
    if (options.userId) {
        formData.append('userId', options.userId);
    }
    if (options.finEvalId) {
        formData.append('finEvalId', options.finEvalId);
    }

    return httpClient.post('credit-request/doc/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

const uploadUserDocument = (file, userId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId); // Ensure userId is included in the request

    return httpClient.post(`/credit-request/doc/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


const uploadMultipleFinancialEvaluationDocuments = async (files, finEvalId) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append("files", file); // Use "files" as the key
    });
    try {
        const response = await httpClient.post(`/credit-request/doc/upload/multiple/${finEvalId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Return response data
    } catch (error) {
        throw error; // Handle errors appropriately
    }
};

const uploadMultipleUserDocuments = async (files, userId) => {
    const formData = new FormData();

    // Append files to FormData
    Array.from(files).forEach((file) => {
        formData.append("files", file); // Use "files" as the key
    });

    try {
        const response = await httpClient.post(`/credit-request/doc/upload/user/multiple/${userId}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Return response data
    } catch (error) {
        throw error; // Handle errors appropriately
    }
};

const getDocument = (finEvalId) =>{
    return httpClient.get(`/credit-request/doc/${finEvalId}`, {
        responseType:"blob",
    });
}

const deleteDocument = (docId) =>{
    return httpClient.delete(`/credit-request/doc/delete/${docId}`)
}

const getAllDocuments = (documentIds) =>{
    return httpClient.post('credit-request/doc/bulk-retrieve', documentIds);
}

export default {example, makeRequest, findById, findAll, saveFinEval, saveCredit,
    getAllCreditRequestsWithCredits, getCreditRequestWithCreditDTO, createFinEvalWithCredits,
    uploadFinancialEvaluationDocument, uploadDocument, uploadMultipleFinancialEvaluationDocuments,
    uploadMultipleUserDocuments,getDocument, deleteDocument, getAllDocuments, uploadUserDocument};