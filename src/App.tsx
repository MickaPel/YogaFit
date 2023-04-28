import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Views/Navbar';
import Exercice from './Views/Exercice';
import Profile from './Views/Profile';
import CreateProgram from './Views/CreateProgram';
import Program from './Views/Program'
import Exercices from './Views/Exercices';
import Home from './Views/Home';
import Footer from './Views/Footer';
import Login from './Views/Login';
import Signup from './Views/Signup';


function App() {

  return (
    <div className="bg-[#2a3c24]">
        
        <Navbar/>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-program" element={<CreateProgram />} />
          <Route path="/program" element={<Program />} />
          <Route path="/poses" element={<Exercices />} />
          <Route path="/pose/:name" element={<Exercice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <Footer />

    </div>
  );
}

export default App;
