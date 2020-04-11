import "./FaultDetails.scss";

import React, { useState, useEffect } from "react";
import FaultChat from "./FaultChat";
import AddFaultMessage from "./AddFaultMessage";
import { addMessage, getMessagesByFaultId } from "../utils/fetchMessageFunctions";

interface Props {
    fault: Fault;
}

function FaultDetails({ fault }: Props) {
    const [messages, setMessages] = useState<Message[]>();

    useEffect(() => {
        async function fetchMessages() {
            const _messages = await getMessagesByFaultId(fault._id) as Message[];
            if (_messages) {
                setMessages(_messages);
            }
        }

        fetchMessages();
    }, [fault._id]);

    async function _onAddMessage(name: string, content: string) {
        const message = await addMessage(fault, content, name);
        if (message && messages) {
            setMessages([...messages, message])
        }
    }

    return <div className="fault-details">
        <FaultChat fault={fault} messages={messages} />
        <AddFaultMessage addNewMessage={_onAddMessage} />
    </div>;
}

export default React.memo(FaultDetails);