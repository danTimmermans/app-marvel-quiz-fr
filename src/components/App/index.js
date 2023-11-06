// à l'origine fichier app.js changé en index.js puis déplacé dans dossie App
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../Header';
import Landing from '../Landing';
import Footer from '../Footer';
import Welcome from '../Welcome';
import Login from '../Login';
import Signup from '../Signup';
import ErrorPage from '../ErrorPage';
import ForgetPassword from '../ForgetPassword';
import '../../App.css';
import { IconContext} from 'react-icons'

function App() {
  return (
    <Router>
      <IconContext.Provider value={{style: {verticalAlign: 'middle'}}}>
        <Header/>

        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/welcome' element={<Welcome/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/forgetpassword' element={<ForgetPassword/>}/>
          <Route path='*' element={<ErrorPage/>} />
        </Routes>
        
        <Footer/>
      </IconContext.Provider>
    </Router>
  );
}

export default App;
