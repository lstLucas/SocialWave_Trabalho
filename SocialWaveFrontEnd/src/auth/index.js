import Cookies from 'universal-cookie';
import {jwtDecode} from 'jwt-decode';
import { apiPost } from '../apis';

const cookies = new Cookies();

export const isAuth = () => {
    const token = cookies.get('jwt_auth');

    return token !== null && token !== undefined;
};

export const getToken = () => {
    const token = cookies.get('jwt_auth');    
    return token;
}

export const nameLoggedUser = () => {
    if (isAuth()) {
        return localStorage.getItem('user_name');
    } else {
        return '';
    }
};

export const permsLoggedUser = () => {
    if (isAuth()) {
        return localStorage.getItem('user_perm');
    } else {
        return '';
    }
};

export const userHasPerm = (perm) => {
    const permissoes = ';' + localStorage.getItem('user_perm') + ';';

    return permissoes.includes(';' + perm + ';');
}

export const registerUser = (user, password, admin, success, erro) => {
    
    apiPost('user/create' + (admin ? 'admin' : ''), {Email: user, Password: password}, (result) => {
        const token = result;
        const decoded = jwtDecode(token);

        const {unique_name, roles} = decoded;

        localStorage.setItem('user_name', unique_name);
        localStorage.setItem('user_perm', roles);
        
        cookies.set('jwt_auth', token, {
            expires: new Date(decoded.exp * 1000), 
        });

        success(unique_name, roles);
    }, erro);    
};

export const login = (user, password, success, erro) => {
    apiPost('user/login', {Email: user, Password: password}, (result) => {
        
        const token = result;
        const decoded = jwtDecode(token);

        const {unique_name, roles} = decoded;

        localStorage.setItem('user_name', unique_name);
        localStorage.setItem('user_perm', roles);

        cookies.set('jwt_auth', token, {
            expires: new Date(decoded.exp * 1000), 
        });

        success(unique_name, roles);
    }, erro);    
};


export const logout = () => {
    cookies.remove('jwt_auth');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_perm');
};
