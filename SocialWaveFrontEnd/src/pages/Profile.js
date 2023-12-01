import React, { useState } from 'react';
import SWLogo from '../images/SWLogo.jpeg';

const Profile = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
      <img src={SWLogo} alt="SW Logo" className="mb-4 w-20 h-auto" />
        <h1 className="text-2xl font-bold mb-4">User Information</h1>
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            User name:
          </label>
          <p id="name" className="text-gray-800 text-lg mb-4"></p>
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email:
          </label>
          <p id="email" className="text-gray-800 text-lg"></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
