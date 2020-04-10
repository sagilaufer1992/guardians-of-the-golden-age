import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { MdAccountCircle } from "react-icons/md";
import "./FaultChat.scss";

// TODO: change to real messages
import { messages as MOCK_MESSAGES } from "../_Mocks/faults";

interface Props {
    fault: Fault;    
}

function FaultChat({ fault }: Props) {
    const [messages, setMessages] = useState<Message[]>();

    useEffect(() => {
        setTimeout(() => setMessages(MOCK_MESSAGES), 300);
    }, []);

    return <div className="chat">
        <div className="title">פירוט התקלה</div>
        {_createChatMessage(fault)}
        {!messages ? <div>טוען...</div> : messages.map(_createChatMessage)}
    </div>;
}

function _createChatMessage({ date, author, content }: Fault | Message, index?: number) {
    const isHamal = author.role === "hamal";
    const commentClass = classNames("comment", { hamal: isHamal });    

    return <div className={commentClass} key={index}>
        <MdAccountCircle className="user-icon" />
        <div className="comment-bubble">
            <div className="bubble-header">
                <div>
                    <label>{isHamal ? "מטפל" : "מדווח"} </label>
                    <span>{author.name}</span>
                </div>
                {!isHamal && <div>
                    <label>טלפון: </label>
                    <span>{author.phone}</span>
                </div>}
            </div>
            <div className="details">{content}</div>
            <div className="date">{date.toLocaleTimeString()}</div>
        </div>
    </div>;
}

export default React.memo(FaultChat);