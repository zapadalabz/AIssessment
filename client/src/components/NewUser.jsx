import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {Button} from "react-bootstrap";
import { googleLogout } from '@react-oauth/google';

export default function NewUser({user, profile, setUser, setProfile}){

    async function addUser(role){
        const response = await fetch(`http://localhost:5000/users/update`, {
            method: "POST",
            body: JSON.stringify({"name": profile.name, "role": role, "email": profile.email}),
            headers: {
            'Content-Type': 'application/json'
            },
        });      
    }

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        localStorage.clear();
      };

    function Profile(){
        return(
          <>
            {profile && (
              <div>
                  <img src={profile.picture} alt="user image" referrerPolicy="no-referrer"/>
                  <h3>Create Account</h3>
                  <p>Name: {profile.name}</p>
                  <p>Email Address: {profile.email}</p>
                  <br />
                  {profile.hd === "branksome.on.ca"?
                  <>
                    <Button variant = "primary" onClick={() => addUser('Student')} className="mx-2">Student</Button>
                    <Button variant = "success" onClick={() => addUser('Teacher')} className="mx-2">Teacher</Button>
                  </>
                  :
                  <p>Sorry but this service is only available to Branksome Hall users at the moment.</p>                  
                  }
                  <br />
                  <Button variant="secondary" onClick={logOut} className="mt-3">Sign out</Button>
              </div>
          )}
        </>
        )
      }
    return(
        <Container>
            <Row className="pt-5">
                <Col className="mx-auto"><h2><span style={{color: "red"}}>A</span>I <span style={{color: "red"}}>F</span>or <span style={{color: "red"}}>L</span>earning</h2></Col>
            </Row>
            <Row>
                <Profile/>
            </Row>
        </Container>

    );
}