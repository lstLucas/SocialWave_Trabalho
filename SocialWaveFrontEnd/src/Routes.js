import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CustomSideBar } from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Feed from "./pages/Feed";

const Router = () => {
    return (<BrowserRouter>
    <CustomSideBar>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<SignUp/>}/>
        <Route path='feed' element={<Feed/>}/>



      </Routes>
    </CustomSideBar>
  </BrowserRouter>);
};

export default Router;