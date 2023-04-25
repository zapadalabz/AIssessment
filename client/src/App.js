import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function App() {
  const href = window.location.href;

  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState(null);

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

    useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                    //console.log(res);
                      setProfile(res.data);
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  /*const callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    console.log(body);
    return body;
  };
  */

  function Profile(){
    return(
      <>
        {profile ? (
          <div>
              <img src={profile.picture} alt="user image" referrerpolicy="no-referrer"/>
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <br />
              <br />
              <button onClick={logOut}>Log out</button>
          </div>
      ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </>
    )
  }

  return (
    <div className="App">
      <h2>AIssessment Login</h2>
      <br/>
      {href.includes("localhost")?"Localhost":"Remote Connection"}
      <br />
      <br />
      <Profile/>
    </div>
  );
}

export default App;
