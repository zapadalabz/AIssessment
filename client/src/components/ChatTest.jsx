import {useState, useRef, useEffect} from "react";
//import { MessageInput} from "@chatscope/chat-ui-kit-react";
import { setResponse } from "../scripts/hf";
import { setOpenAIResponse } from "../scripts/openAI";
import MessageDisplay from "./Message/MessageDisplay";
import { extractPDFText } from "../scripts/processFile";
import MessageInput from "./MessageInput/MessageInput";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import Stack from 'react-bootstrap/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";

export default function ChatPage() {
  const inputRef = useRef();
  const fileInput = useRef();
  const [showOverlay, setShowOverlay] = useState(false);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const [attachText, setAttachText] = useState([]);
  const [attachCount, setAttachCount] = useState(0);

    useEffect(()=>{
        console.log(attachText);
        setAttachCount(attachText.length);
    },[attachText])

  const handleSend = (message,c1,c2,c3) => {
    message = c2;
    //console.log(inputRef.current.attachButton.buttonA.button);
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
        sender: "Zach",
        attachments: attachText
      });
      temp.push({
        message: "",
        direction: 'incoming',
        sender: "Ribbit"
      });
      setMessages(temp);
      setMsgInputValue("");
      setOpenAIResponse(message, temp, setMessages, running, setRunning, attachText);
      setAttachText([])      
    }
    inputRef.current.focus();
  };

    const handleAttachClick = () => {
      //console.log(inputRef.current.attachButton.buttonA.button.children);
      setShowOverlay(!showOverlay);
    }
    const handlePDFClick = () => {
      fileInput.current.click()
    }

    const handleFileChange = event => {
        //setFiles([...files, ...event.target.files]);
        console.log(event.target.files);
        extractPDFText(event.target.files).then((text) => setAttachText(text));
        event.target.value = ''
    }

  return (
    <div className="mainChat">
            <MessageDisplay messages={messages}/>
              
            <div as={MessageInput} className="messageInputDIV">
                <MessageInput ref={inputRef} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={true} onSend={handleSend} onAttachClick={handleAttachClick} className="messageInput" attachCount={attachCount}/>
                <Overlay target={inputRef.current!==undefined?inputRef.current.attachButton.buttonA.button:inputRef} show={showOverlay} placement="top" rootClose onHide={() => setShowOverlay(false)}>
                  {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                  }) => (
                    <div
                      {...props}
                      style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: '2px 5px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                      }}
                    >
                      <Stack direction="horizontal" gap={3}>
                          <FontAwesomeIcon className="fa-2x attachIcon" icon={faFileExcel} />
                          <FontAwesomeIcon className="fa-2x attachIcon" icon={faFilePdf} onClick={handlePDFClick}/>
                          <span className="fa-layers fa-fw attachIcon">
                            <FontAwesomeIcon className="fa-2x" icon={faFilePdf} />
                            <span className="fa-layers-counter fa-2x" style={{background:'Tomato'}}>1,419</span>
                          </span>
                            
                      </Stack>
                    </div>
                  )}
                </Overlay>                       
            </div>
            
            <div style={{display: 'none'}}>
                <input type="file" accept=".pdf" ref={fileInput} onChange={(e) => handleFileChange(e)} multiple></input>
            </div>
    </div>
  )
}