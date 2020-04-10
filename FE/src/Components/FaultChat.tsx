import React from "react";
import classNames from "classnames";
import { MdAccountCircle } from "react-icons/md";
import "./FaultChat.scss";

const mock = {
    id: "lala",
    title: 'מתנ"ס אבו גוש',
    status: "Todo",
    category: "drugs",
    user: {
        name: "שירן",
        phone: "050-0000000",
        email: "shiran@walla.com"
    },
    date: new Date(),
    hierarchy: "להלה",
    chatHistory: [{
        name: "אבי שמעוני",
        role: "DistributionManager",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }, {
        name: "אבי שמעוני",
        role: "Hamal",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }, {
        name: "אבי שמעוני",
        role: "Hamal",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }]
} as Fault;

interface Props {
    fault?: Fault;
}

function FaultChat({ fault }: Props) {
    return <div className="chat">
        <div className="title">פירוט התקלה</div>
        {mock.chatHistory.map((comment, index) => {
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