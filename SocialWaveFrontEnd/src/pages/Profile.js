import React, { useState, useEffect } from 'react';
import { isAuth, logout, nameLoggedEmail, nameLoggedUser } from '../auth';
import { useQuery } from '../useQuery';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../auth';
import SWLogo from '../images/SWLogo.jpeg';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const result = await nameLoggedUser();
        const resultEmail = await nameLoggedEmail();
        setUsername(result);
        setEmail(resultEmail);
      } catch (error) {
        console.error('Erro ao obter o nome de usuário ou email:', error);
      }
    }

    fetchUserInfo();
}, []);


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
      <img src={SWLogo} alt="SW Logo" className="mb-4 w-20 h-auto" />
        <h1 className="text-2xl font-bold mb-4">User Information</h1>
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Username: {username}
          </label>
          <p id="name" className="text-gray-800 text-lg mb-4"></p>
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email: {email}
          </label>
          <p id="email" className="text-gray-800 text-lg"></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
