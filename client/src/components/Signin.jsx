import React from "react"
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import { userExists } from "../scripts/mongo";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Signin({setUser, setProfile}){
    return(
        <Container>
            <Row className="pt-5">
                <Col className="mx-auto"><h2><span style={{color: "red"}}>A</span>I <span style={{color: "red"}}>F</span>or <span style={{color: "red"}}>L</span>earning</h2></Col>
            </Row>
            <Row className="pt-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <br/>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                        let tempUser = jwt_decode(credentialResponse.credential);              
                        userExists(tempUser.email).then( (resp) => {
                            if(resp){
                                tempUser['role'] = resp.role;
                                setProfile(tempUser);
                                setUser(credentialResponse.credential);                        
                                localStorage.setItem('userCredential',credentialResponse.credential);
                                localStorage.setItem('userRole',resp.role);
                            }
                            else{
                                setProfile(tempUser);
                                setUser("new: "+credentialResponse.credential);
                            }
                        });
                        
                        }}
                        onError={() => {
                        console.log('Login Failed');
                        }}
                        auto_select
                    />
                </Col>
            </Row>            
        </Container>
    )
}