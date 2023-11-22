import React, {useState, createContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { isAuth, logout, nameLoggedUser, permsLoggedUser } from "../../auth";
import "./style.css";
import SocialWaveTitle from '../../Images/SWLogo.jpeg'


const Layout = () => {
    const navigate = useNavigate();

    const sair = () => {
        logout();
        
        navigate('/');
    };

    let loginLogout = isAuth() ? (
        <li className="nav-item">
            <button className="nav-link btn" onClick={sair}>Logout</button>
        </li>
    ) : (
        <li className="nav-item">
            <a className="nav-link" href="/login">Login</a>
        </li>
    );

    const nomeUsuario = nameLoggedUser();
    
    const usuarioIdentificacao = nomeUsuario ? <p className="mt-2">{nomeUsuario}</p> : null;

    const cadastrarAdmin = permsLoggedUser('Admin') ? (
        <a className="dropdown-item" href="/registrar/admin">Criar Usuário Admin</a>
    ) : null;

    return (
        <React.Fragment>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <div className="NavBar" id="navbarSupportedContent">
                <img src={SocialWaveTitle} width={'40%'} />
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                            <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Cadastros
                            </a>
                            {/* <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/atleta">Atletas</a>
                                <a className="dropdown-item" href="/treinador">Treinadores</a>
                                { cadastrarAdmin }
                            </div> */}
                        </li>
                        {usuarioIdentificacao}
                        {loginLogout}
                    </ul>
                </div>
                

            </nav>      
            <Outlet />
        </React.Fragment>
    );
};
export default Layout;
