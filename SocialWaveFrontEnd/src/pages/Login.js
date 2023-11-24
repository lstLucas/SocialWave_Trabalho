import React, {useState} from 'react';
import {useQuery} from '../useQuery';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../auth';
import SWLogo from '../images/SWLogo.jpeg';

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
            <h1>Login</h1>
        </div>
        {/* <button onClick={navegar}>Navegar</button> */}
        <form>
            <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" className="form-control" value={object.name} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="email" name="email" aria-describedby="emailHelp" placeholder="Entre com o e-mail" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input type="password" className="form-control" value={object.password} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="password" name="password" placeholder="Digite a sua senha" />
            </div>
            <button type="submit" className="btn btn-primary mt-2" onClick={logar}>Entrar</button>
            <span> </span>
            <Link className="btn btn-secondary mt-2" to={'/signup?redirect=' + redirectTo}>Sign up for free</Link>
        </form>
    </div>
    );
};

export default Login;