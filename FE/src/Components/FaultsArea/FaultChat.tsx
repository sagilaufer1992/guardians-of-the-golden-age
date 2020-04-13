import "./FaultChat.scss";
import React from "react";
import classNames from "classnames";
import { MdAccountCircle } from "react-icons/md";

import { isHamal } from "../../utils/roles";

interface Props {
    fault: Fault;
    messages: Message[] | undefined;
}

function FaultChat({ fault, messages }: Props) {
    return <div className="chat">
        <div className="title">פירוט התקלה</div>
        {_createChatMessage(fault)}
        {!messages ? <div>טוען...</div> : messages.map(_createChatMessage)}
    </div>;
}

function _createChatMessage({ date, author, content }: Fault | Message, index?: number) {
    const isAuthorHamal = isHamal(author);
    const commentClass = classNames("comment", { hamal: isAuthorHamal });

    return <div className={commentClass} key={index}>
        <div className="user-icon"><MdAccountCircle /></div>
        <div className="comment-bubble">
            <div className="bubble-header">
                <div>
                    <label>{isAuthorHamal ? "מטפל" : "מדווח"} </label>
                    <span>{author.name}</span>
                </div>
                {!isAuthorHamal && <div>
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