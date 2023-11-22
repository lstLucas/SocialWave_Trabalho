import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./screens/Layout/Layout";
import Home from "./screens/Home/Home";
import Login from './screens/Login/Login';

const Rotas = () => {
    return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />}></Route>
          </Route>
        </Routes>
  </BrowserRouter>
  );
};

export default Rotas;
