import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Navbar from './Views/Navbar';
import Exercice from './Views/Exercice';
import Profile from './Views/Profile';
import Programm from './Views/Program';
import Exercices from './Views/Exercices';
import Home from './Views/Home';
import Footer from './Views/Footer';
import Login from './Views/Login';
import Signup from './Views/Signup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


function App() {

  // const [currentUser, setCurrentUser] = useState(null)

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     setCurrentUser(user)
  //   })
  // }, [currentUser])

  return (
    <div className="bg-[#2a3c24]">
      {/* <BrowserRouter> */}
        
        <Navbar/>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/programms" element={<Programm />} />
          <Route path="/poses" element={<Exercices />} />
          <Route path="/pose/:name" element={<Exercice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <Footer />

      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
