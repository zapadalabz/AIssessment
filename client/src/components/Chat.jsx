import {useState, useRef, useEffect} from "react";
import { MessageInput} from "@chatscope/chat-ui-kit-react";
import { setResponse } from "../scripts/hf";
import MessageDisplay from "./Message/MessageDisplay";
import { readPDF, extractPDFText } from "../scripts/processFile";

export default function ChatPage() {
  const inputRef = useRef();
  const fileInput = useRef()
  const [files, setFiles] = useState([]);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const [attachText, setAttachText] = useState('');

    useEffect(()=>{
        console.log(attachText);
    },[attachText])

  const handleSend = message => {
    /*setMessages([...messages,{
      message,
      direction: 'outgoing',
      sender: "ZED"
    }]);*/
    if(!running){
      let temp = messages;
      temp.push({
        message,
        direction: 'outgoing',
        sender: "Zach"
      });
      temp.push({
        message: "",
        direction: 'incoming',
        sender: "Ribbit"
      });
      setMessages(temp);
      setMsgInputValue("");
      setResponse(message, temp, setMessages, running, setRunning);
    }
    inputRef.current.focus();
  };

    const handleAttachClick = () => {
        fileInput.current.click()
    }

    const handleFileChange = event => {
        //setFiles([...files, ...event.target.files]);
        extractPDFText(event.target.files).then((text) => setAttachText(text));
    }

  return (
    <div className="mainChat">
            <MessageDisplay messages={messages}/>
              
            <div as={MessageInput} className="messageInputDIV">
                <MessageInput ref={inputRef} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={true} onSend={handleSend} onAttachClick={handleAttachClick} style={{
                    flexGrow: 1,
                    borderTop: 0,
                    flexShrink: "initial"
                    }} />                                
            </div>
            <div style={{display: 'none'}}>
                <input type="file" accept=".pdf" ref={fileInput} onChange={(e) => handleFileChange(e)} multiple></input>
            </div>
    </div>
  )
}