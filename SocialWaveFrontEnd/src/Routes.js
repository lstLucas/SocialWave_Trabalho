import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

const Rotas = () => {
    return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
  </BrowserRouter>
  );
};

export default Rotas;