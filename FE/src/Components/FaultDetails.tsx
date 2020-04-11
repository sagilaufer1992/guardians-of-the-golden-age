import "./FaultDetails.scss";

import React, { useState, useEffect, useContext } from "react";
import FaultChat from "./FaultChat";
import AddFaultMessage from "./AddFaultMessage";
import { addMessage, getMessagesByFaultId } from "../utils/fetchMessageFunctions";
import UserProvider from "../utils/UserProvider";

interface Props {
    fault: Fault;
}

function FaultDetails({ fault }: Props) {
    const user = useContext(UserProvider);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        fetchMessages();
    }, [fault._id]);

    async function fetchMessages() {
        const newMessages = await getMessagesByFaultId(user, fault._id) as Message[];
        if (!newMessages) return alert("אירעה שגיאה בקבלת הודעות");

        setMessages(newMessages);
    }

    async function _onAddMessage(name: string, content: string) {
        const message = await addMessage(user, fault._id, { content, author: { name } });
        if (!message) return alert("אירעה שגיאה בהוספת הודעה");

        setMessages([...messages, message]);
        fetchMessages();
    }

    return <div className="fault-details">
        <FaultChat fault={fault} messages={messages} />
        {user.role === "hamal" && <AddFaultMessage addNewMessage={_onAddMessage} />}
    </div>;
}

export default React.memo(FaultDetails);