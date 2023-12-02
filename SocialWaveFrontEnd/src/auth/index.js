import Cookies from 'universal-cookie';
import {jwtDecode} from 'jwt-decode';
import { apiAuthGet, apiAuthPut, apiPost } from '../apis';

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
        return localStorage.getItem('user_username');
    } else {
        return '';
    }
};

export const nameLoggedEmail = () => {
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

export const getAllPosts = (success, error, navigate, locationUrl) => {
    apiAuthGet('post', success, error, navigate, locationUrl);
};

export const registerUser = (user, password, username, admin, success, erro) => {
    
    apiPost('user/create' + (admin ? 'admin' : ''), {Email: user, Password: password, Username: username}, (result) => {
        const token = result;
        const decoded = jwtDecode(token);

        const {unique_name, roles} = decoded;

        localStorage.setItem('user_name', user);
        localStorage.setItem('user_perm', roles);
        localStorage.setItem('user_username', username);
        
        cookies.set('jwt_auth', token, {
            expires: new Date(decoded.exp * 1000), 
            sameSite: 'strict'
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

export const updateLike = (post, like, success, error) => {
    post.likes += like;
    apiAuthPut('post', post.id, post, success, error );
}

export const logout = () => {
    cookies.remove('jwt_auth');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_perm');
};