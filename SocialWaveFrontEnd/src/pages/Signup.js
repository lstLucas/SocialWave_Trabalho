import React, {useState} from 'react';
import {useQuery} from '../useQuery';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { registerUser, userHasPerm } from '../auth';
import SWLogo from '../images/SWLogo.jpeg';

const SignUp = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [object, setObject] = useState({email: '', password: '', username: ''});

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

    const signup = (e) => {
        e.preventDefault();

        if(userHasPerm('Admin'))
          registerUser(object.email, object.password, object.username, true, sucesso, erro);
        else
        registerUser(object.email, object.password, object.username, false, sucesso, erro);
          
    };

    const navegar = () => {
        let url = query.get('redirect');

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
        <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <div className='text-center mb-4'>
            <img className='mx-auto w-16 h-16' src={SWLogo} alt="Logo"></img>
            <h1 className='text-xl font-semibold'>Create Your Account</h1>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={object.username}
                onChange={(e) => alterarCampo(e.target.name, e.target.value)}
                id="username"
                name="username"
                placeholder="e.g, Lsteixeira"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={object.email}
                onChange={(e) => alterarCampo(e.target.name, e.target.value)}
                id="email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="e.g, lst@email.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={object.password}
                onChange={(e) => alterarCampo(e.target.name, e.target.value)}
                id="password"
                name="password"
                placeholder="e.g, ******"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
              onClick={signup}
            >
              Sign Up
            </button>
            <p className="text-center mt-4">
              <Link
                to={'/login' + redirectTo}
                className="text-blue-500 hover:underline"
              >
                Already have an account? Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      
    );
};

export default SignUp;