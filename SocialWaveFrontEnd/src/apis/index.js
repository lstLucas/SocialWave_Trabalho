import axios from "axios";
import Cookies from 'universal-cookie';
import {isAuth, getToken} from '../auth';

const baseURL = 'http://localhost:5286/api'
const cookies = new Cookies();

export const checkAuth = (navigate, locationUrl) => {
    if(!isAuth()) {
        navigate('/login?redirect=' + locationUrl);
    }
};

export const apiAuthGet = (url, success, erro, navigate, locationUrl) => {
    checkAuth(navigate, locationUrl);

    const instance = axios.create({
        baseURL: `${baseURL}`,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });

    instance.get(`/${url}`).then(result => {
        success(result.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiAuthGetById = (url, id, success, erro, navigate, locationUrl) => { 
    checkAuth(navigate, locationUrl);

    const instance = axios.create({
        baseURL: `${baseURL}`,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });

    instance.get(`/${url}/${id}`).then(result => {
        success(result.data);
    }).catch(error => {
        console.log(erro);
        erro(error);
    });
};

export const apiAuthPost = (url, objeto, success, erro) => { 
    checkAuth();
    
    const instance = axios.create({
        baseURL: `${baseURL}`,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });

    instance.post(`/${url}`, objeto).then(result => {
        success(result.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiAuthPut = (url, id, objeto, success, erro) => { 
    checkAuth();
    
    const instance = axios.create({
        baseURL: `${baseURL}`,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });

    instance.put(`/${url}/${id}`, objeto).then(() => {
        success(Response.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiAuthDelete = (url, id, success, erro) => { 
    checkAuth();
    
    const instance = axios.create({
        baseURL: `${baseURL}`,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });

    instance.delete(`/${url}/${id}`).then(() => {
        success();
    }).catch(error => {
        erro(error);
    });
};

export const apiGet = (url, success, erro) => {
    axios.get(`${baseURL}/${url}`).then(result => {
        success(result.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiGetById = (url, id, success, erro) => { 
    axios.get(`${baseURL}/${url}/${id}`).then(result => {
        success(result.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiPost = (url, objeto, success, erro) => { 
    axios.post(`${baseURL}/${url}`, objeto).then(result => {
        success(result.data);
    }).catch(error => {
        erro(error);
    });
};

export const apiPut = (url, id, objeto, success, erro) => { 
    axios.put(`${baseURL}/${url}/${id}`, objeto).then(() => {
        success();
    }).catch(error => {
        erro(error);
    });
};

export const apiDelete = (url, id, success, erro) => { 
    axios.delete(`${baseURL}/${url}/${id}`).then(() => {
        success();
    }).catch(error => {
        erro(error);
    });
};