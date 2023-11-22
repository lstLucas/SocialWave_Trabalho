import React, {useState} from 'react';
import {useQuery} from '../useQuery';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../auth';

const Login = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [objeto, setObjeto] = useState({email: '', senha: ''});

    let redirecionarPara = query.get('redirect');

    if (!redirecionarPara) {
        redirecionarPara = '/';
    }
    
    const sucesso = (result) => {
        navegar();
    }

    const erro = (e) => {
        console.log(e);
    }

    const logar = (e) => {
        e.preventDefault();
        login(objeto.email, objeto.senha, sucesso, erro)
    };

    const navegar = () => {
        let url = query.get('redirect');

        console.log("'"+url+"'");

        if (!url) {
            url = '/';
        }

        navigate(url);
    };

    const alterarCampo = (nome, valor) => {
        let obj = {...objeto};
        obj[nome] = valor;
        setObjeto(obj);
    };

    return (
    <div className="mx-5">
        <h1>Login</h1>
        {/* <button onClick={navegar}>Navegar</button> */}
        <form>
            <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" className="form-control" value={objeto.nome} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="email" name="email" aria-describedby="emailHelp" placeholder="Entre com o e-mail" />
            </div>
            <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" className="form-control" value={objeto.senha} onChange={(e) => alterarCampo(e.target.name, e.target.value)} id="senha" name="senha" placeholder="Digite a sua senha" />
            </div>
            <button type="submit" className="btn btn-primary mt-2" onClick={logar}>Entrar</button>
            <span> </span>
            <Link className="btn btn-secondary mt-2" to={'/registrar?redirect=' + redirecionarPara}>Criar Novo Usuário</Link>
        </form>
    </div>);
};

export default Login;
