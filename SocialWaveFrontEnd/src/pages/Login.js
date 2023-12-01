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

    const signIn = (e) => {
        e.preventDefault();
        login(object.email, object.password, sucesso, erro);
    };

    const navegar = () => {
        let url = query.get('redirect');

        console.log("'"+url+"'");

        if (!url) {
            url = '/feed';
        }

        navigate(url);
    };

    const alterarCampo = (name, value) => {
        let obj = {...object};
        obj[name] = value;
        setObject(obj);
    };

    return (
        <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <div className='text-center mb-4'>
            <img className='mx-auto w-16 h-16' src={SWLogo} alt="Logo"></img>
            <h1 className='text-xl font-semibold'>Login</h1>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={object.name}
                onChange={(e) => alterarCampo(e.target.name, e.target.value)}
                id="email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Entre com o e-mail"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Senha</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={object.password}
                onChange={(e) => alterarCampo(e.target.name, e.target.value)}
                id="password"
                name="password"
                placeholder="Digite a sua senha"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
              onClick={signIn}
            >
              Entrar
            </button>
            <p className="text-center mt-4">
              <Link
                to={'/signup?redirect=' + redirectTo}
                className="text-blue-500 hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>
      
    );
};

export default Login;