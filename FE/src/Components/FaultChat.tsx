import React from "react";
import classNames from "classnames";
import { MdAccountCircle } from "react-icons/md";
import "./FaultChat.scss";

interface Props {
    fault: Fault;
}

function FaultChat({ fault }: Props) {
    return <div className="chat">
        <div className="title">פירוט התקלה</div>
        {fault.chatHistory.map((comment, index) => {
            const isHamal = comment.role === "Hamal";
            const commentClass = classNames("comment", { hamal: isHamal });

            return <div className={commentClass} key={index}>
                <MdAccountCircle className="user-icon" />
                <div className="comment-bubble">
                    <div className="bubble-header">
                        <div>
                            <label>{isHamal ? "מטפל" : "מדווח"} </label>
                            <span>{comment.name}</span>
                        </div>
                        {!isHamal && <div>
                            <label>טלפון: </label>
                            <span>05055555555</span>
                        </div>}
                    </div>
                    <div className="details">{comment.content}</div>
                    <div className="date">{comment.date.toLocaleTimeString()}</div>
                </div>
            </div>
        })}
    </div>;
}

export default React.memo(FaultChat);