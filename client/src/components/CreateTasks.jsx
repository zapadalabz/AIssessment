import React from "react";
import {set, useForm} from "react-hook-form";
import { useState, useRef, useEffect } from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import xlsxIcon from "../img/xlsx_icon.png";

import * as xlsx from 'xlsx'
import { setAnswer } from "../scripts/hf";

export default function CreateTask(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [prompt, setPrompt] = useState("");
    const [title, setTitle] = useState("");
    const [system, setSystem] = useState("");
    const [preview, setPreview] = useState("");
    const [xlsxName, setXlsxName] = useState("");
    const [xlsxJSON, setXlsxJSON] = useState([{}]);
    const [togglePreview, setTogglePreview] = useState(false);

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setXlsxJSON(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
            setXlsxName(e.target.files[0].name);
        }
    }

    const onSubmit = data => console.log(data);
    const handleChange = (e) => {  
        setTogglePreview(false);      
        setPrompt(e.target.value);
    }
    const handleVar = (e) => {
        setTogglePreview(false);
        setPrompt(prompt + "{$"+e.target.innerHTML+"} ");
    }
    const handleReplace = (i = 0) => {
        let tempPrompt = prompt;
        if(i < xlsxJSON.length){
            Object.keys(xlsxJSON[i]).forEach((key,index)=>{
                const value = "{$"+key+"}";
                tempPrompt = tempPrompt.replaceAll(value,xlsxJSON[i][key]);
                //console.log(tempPrompt);
            });
            //setPreview(tempPrompt);
            setAnswer(tempPrompt,tempPrompt, setPreview);
        }
        else{
            setPreview("End of file");
        }
        
    }
    const handlePreview = () =>{
        if(!togglePreview) handleReplace(0);
        setTogglePreview(!togglePreview);

    }

    let varList = Object.keys(xlsxJSON[0]).map((key,index)=>{
        //console.log(key,index);
        return(
        <>
            <span key={index} className="varItem" onClick={handleVar}>{key}</span>
            <br/>
        </>)
    });

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <Row>
                    <Col sm={11}>
                        <label htmlFor="Title"><strong>Title: </strong></label>
                        <input name="Title" value={title} className="taskTitle" {...register('title',{onChange: (e)=>{setTitle(e.target.value)}})}/>
                        <Button className="" type="submit">Save</Button>
                        <br/>
                        <label htmlFor="Title"><i>System: </i></label>
                        <input name="Title" value={system} className="taskSystem" {...register('system',{onChange: (e)=>{setSystem(e.target.value)}})}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={11}>
                    <textarea value={prompt} rows={1} className="taskPromptInput"  {...register('prompt',{onChange:handleChange})}/>
                        <div className="playgroundDiv">                            
                            <Button className="playgroundSubmit" type="submit">Send</Button>
                            <Button onClick={handlePreview}>Generate Preview</Button>
                        </div>
                    </Col>
                    <Col sm={1}>
                        Model: GPT-3.5
                        <label htmlFor="upload">
                            <img src={xlsxIcon} className="xlsxIcon"/>
                            {xlsxName}
                        </label>                        
                        <input type="file" name="upload" id="upload" onChange={readUploadFile} className="xlsxInputButton"/>
                        {varList}
                    </Col>
                </Row>
                <Row>
                    <Col sm={11}>
                        {togglePreview && (<div className="taskPromptPreview">
                                {preview}
                                <p className="pt-2">
                                    Response:
                                </p>
                            </div>)}
                    </Col>
                </Row>             
            </Container>
        </form>
    )
}