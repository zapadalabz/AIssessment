import React from "react";
import {useForm} from "react-hook-form";
import { useState, useRef, useEffect } from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";

import { setAnswer } from "../scripts/hf";


export default function Playground(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [text, setText] = useState("");
    const [output, setOutput] = useState("");
    const textAreaRef = useRef(null);

    const resizeTextArea = () => {
        try{
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";           
        }catch{
            console.log("resize error");
        }        
    };

    useEffect(resizeTextArea,[text]);

    const onSubmit = data => {
        setAnswer(text,output, setOutput);
    }

    const handleChange = (e) => {        
        setText(e.target.value);
    }


    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <Row>
                    <Col sm={11}>
                        <div className="playgroundOutput">{output}</div>
                        <div className="playgroundDiv">
                            <textarea value={text} rows={1} className="playgroundPromptInput"  {...register('prompt',{onChange:handleChange})} ref={textAreaRef}/>
                            <Button className="playgroundSubmit" type="submit">Send</Button>
                        </div>
                    </Col>
                    <Col sm={1}>
                        Model: google/flan-t5-xxl
                    </Col>
                </Row>                
            </Container>
        </form>        
    )
}