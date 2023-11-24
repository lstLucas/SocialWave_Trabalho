import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./screens/Layout/Layout";
import Home from "./screens/Home/Home";
import Login from './screens/Login/Login';
import SignUp from './screens/SignUp/SignUp';

const Rotas = () => {
    return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />}/>
            <Route path='signup' element={<SignUp />}/>
          </Route>
        </Routes>
  </BrowserRouter>
  );
};

export default Rotas;