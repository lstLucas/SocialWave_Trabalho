import React, {useState} from 'react';
import {useQuery} from '../../useQuery';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../auth';
import './style.css';
import SWLogo from '../../Images/SWLogo.jpeg';

const Login = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [object, setObject] = useState({email: '', password: ''});

    let redirectTo = query.get('redirect');

    if (!redirectTo) {
        redirectTo = '/';
    }
    
    const sucesso = (result) => {
        navegar();
    }

    const erro = (e) => {
        console.log(e);
    }

    const logar = (e) => {
        e.preventDefault();
        login(object.email, object.password, sucesso, erro)
    };

    const navegar = () => {
        let url = query.get('redirect');

        console.log("'"+url+"'");

        if (!url) {
            url = '/';
        }

        navigate(url);
    };

    const alterarCampo = (name, value) => {
        let obj = {...object};
        obj[name] = value;
        setObject(obj);
    };

    return (
    <div className="login-container">
        <div className='header'>
            <img id='logo' src={SWLogo}></img>
            <h1>Create Your Account</h1>
        </div>
        <form>
        <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" value={object.username} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="username" name="username" placeholder="e.g, Lsteixeira" />
            </div>
            <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" className="form-control" value={object.name} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="email" name="email" aria-describedby="emailHelp" placeholder="e.g, lst@email.com" />
            </div>
            <div className="form-group">
                <label htmlFor="senha">Password</label>
                <input type="password" className="form-control" value={object.password} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="senha" name="senha" placeholder="e.g, ******" />
            </div>
            <button type="submit" className="btn btn-primary mt-2" onClick={logar}>Sign Up</button>
            <span> </span>
            <Link className="btn btn-secondary mt-2" to={'/signup?redirect=' + redirectTo}>Sign up for free</Link>
        </form>
    </div>
    );
};

export default Login;
