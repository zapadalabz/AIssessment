import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { Routes, Route } from "react-router-dom";
import Signin from './components/Signin';
import Navigation from './components/Navigation';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import NewUser from './components/NewUser';


function App() {

  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);

 //Check if user has a persistent login in localStorage
  useEffect(() => {
    const persistentLogin = localStorage.getItem('userCredential');
    //console.log(persistentLogin);
    if (persistentLogin === "new") {
      //Sign in again
    }
    else if(persistentLogin){
      setUser(persistentLogin);
      setProfile(jwt_decode(persistentLogin));
    }
  },[]);

  const callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    console.log(body);
    return body;
  };

  async function fetchData(){
    const response = await fetch(`http://localhost:5000/users`)
      .then(res => res.json())
      .then(data => console.log(data));
  }

  async function addUser(){
    await fetch(`http://localhost:5000/users/update`, {
     method: "POST",
     body: JSON.stringify({"name": profile.name, "role": "Teacher", "email": profile.email}),
     headers: {
       'Content-Type': 'application/json'
     },
   });
  }

  function Profile(){
    return(
      <>
        {profile && (
          <div>
              <img src={profile.picture} alt="user image" referrerPolicy="no-referrer"/>
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <button onClick={addUser}>ADD</button>
          </div>
      )}
    </>
    )
  }

  function Content(){
    if(user){
      if(user.substring(0,5) === "new: "){
        return(<NewUser user={user} profile={profile} setUser={setUser} setProfile={setProfile}/>);
      }
      else{
        return(
          <Container>
            <Row>
              <Navigation setUser={setUser} setProfile={setProfile}/>
            </Row>
            <Row className='navSpacer'>
              <Routes>
                <Route exact path="/" element={<div>Main Page <br/> <Profile/></div>} />
                <Route path="/Teacher" element={<div>Hello Teacher  <br/> <Profile/> </div>}/>
              </Routes>
            </Row>
          </Container>
        );
      }
    }    
    else{
      return(<Signin setUser={setUser} setProfile={setProfile}/>);
    }
  }


  return (
    <div className="App">
      <Content/>          
    </div>
  );
}

export default App;
