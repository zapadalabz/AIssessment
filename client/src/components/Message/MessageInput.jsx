import React, {forwardRef, useState, useEffect} from "react";
import { FaRegPaperPlane } from "react-icons/fa";

//<textarea ref={ref} value={props.msg} className="messageInputContent" onChange={(e)=>{props.setMsg(e.target.value)}} onKeyDown={onEnterPress}/>

const MessageInput = forwardRef(function MessageInput(props, divRef){
    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          if(props.msg.length>0)props.onSend();
        }
      }

      function InputBox(){
        const [text, setText] = useState(props.msg);

        useEffect(() => {
            divRef.current.innerText = text;
            divRef.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(divRef.current.childNodes[0], text.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }, [text]);

        function handleInput(event){
            const text = event.target.innerText;
            setText(text);
        }

        return(
            <div ref={divRef} key="msgIn" className="messageContent" contentEditable onInput={handleInput} dangerouslySetInnerHTML={{ __html: text }}></div>
        );
      }
      
    return(
        <div className="messageInputDIV">
            <div className="messageInput">
                <div className="messageInputContainer">
                <div className="messageInputScroll">
                    <InputBox/>
                </div>
                </div>
                <div className="messageInputTools">
                    <button className="messageSendBtn" disabled={props.msg.length===0} onClick={props.onSend}><FaRegPaperPlane/></button>
                </div>         
            </div>        
        </div>
    )
    }
);

export default MessageInput;