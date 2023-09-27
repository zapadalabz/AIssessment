import React, { useEffect, useRef } from "react";
import ribbit from "../../img/ribbit.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";

export default function MessageDisplay(props){
    let messages = props.messages;

    const AlwaysScrollToBottom = () => {
        const messagesEndRef = useRef();
        useEffect(() => messagesEndRef.current.scrollIntoView({ behavior: "smooth" }));
        return <div ref={messagesEndRef} />;
      };
    

    return(
        <div className="messageListContainer">
            <div className="messageListScrollbar">
                {messages.map((m, i) =>{
                    if(m.direction==="incoming"){
                        return(
                            <div key={i} className="messageIncoming">
                            <img src={ribbit} alt="ribbitAvatar" className="messageAvatar"></img>
                            {m.message}
                        </div> 
                        );
                    }else if(m.direction==="outgoing"){
                        return(
                            <div key={i} className="messageOutgoing">
                                {m.message}
                                {m.attachments.length>0 ?
                                <>
                                <br/><br/>
                                <span className="fa-layers fa-fw">
                                    <FontAwesomeIcon className="fa-2x" icon={faFilePdf} />
                                    <span className="fa-layers-counter fa-2x" style={{background:'Tomato', cursor:'default'}}>{m.attachments.length}</span>
                                </span>
                                </>:""}
                            </div>                                         
                        ); 
                    }else{
                        return(
                            <div>
                                "Something went wrong..."
                            </div>
                        );
                    }                                     
                })
                }
                <AlwaysScrollToBottom/>
            </div>
        </div>
    )
}