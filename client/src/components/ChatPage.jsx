import {useState, useMemo, useRef } from "react";
import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, MessageGroup, Message,
  ChatContainer, MessageList, MessageInput} from "@chatscope/chat-ui-kit-react";
import ribbit from "../img/ribbit.jpg";
import xlsxImg from "../img/xlsx_icon.png";
import { setResponse } from "../scripts/hf";

export default function ChatPage() {
  const inputRef = useRef();
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);

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


  return (
    <div style={{height: "500px"}}>
        <ChatContainer>                            
            <MessageList>
                {messages.map((m, i) => 
                  <Message key={i} model={m}>
                    <Avatar src={ribbit} name="Ribbit"/>
                  </Message>
                )}
            </MessageList>
                    
            <div as={MessageInput} style={{
                    display: "flex",
                    flexDirection: "row",
                    borderTop: "1px dashed #d1dbe4"
                    }}>
                <MessageInput ref={inputRef} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={false} onSend={handleSend} style={{
                    flexGrow: 1,
                    borderTop: 0,
                    flexShrink: "initial"
                    }} />                                
            </div>
        </ChatContainer>            
    </div>
  )
}