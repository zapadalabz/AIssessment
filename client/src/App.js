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
import CreateTask from './components/CreateTasks';
import TaskList from './components/TaskList';
import TeacherHome from './components/TeacherHome';
import StudentHome from './components/StudentHome';

function App() {

  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);

 //Check if user has a persistent login in localStorage
  useEffect(() => {
    const persistentLogin = localStorage.getItem('userCredential');
    const persistentRole = localStorage.getItem('userRole');
    //console.log(persistentLogin);
    if (persistentLogin === "new") {
      //Sign in again
    }
    else if(persistentLogin){
      setUser(persistentLogin);
      let tempUser = jwt_decode(persistentLogin);
      tempUser['role'] = persistentRole;
      setProfile(tempUser);
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

  function Profile(){
    return(
      <>
        {profile && (
          <div>
              <img src={profile.picture} alt="user image" referrerPolicy="no-referrer"/>
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
          </div>
      )}
    </>
    )
  }

  function HomePage(){
    if(profile.role === "Student"){
      return <StudentHome/>
    } else if (profile.role === "Teacher"){
      return <TeacherHome/>
    }else {
      return (<>
      <h1>Unknown Role</h1>
      </>)
    }
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
              <Navigation profile={profile} setUser={setUser} setProfile={setProfile}/>
            </Row>
            <Row className='navSpacer'>
              <Routes>
                <Route exact path="/" element={<HomePage/>} />
                <Route path="/CreateTask" element= {<CreateTask/>} />
                <Route path="/TaskList" element={<TaskList/>}/>
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
