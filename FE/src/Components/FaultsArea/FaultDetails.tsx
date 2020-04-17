import "./FaultDetails.scss";
import React, { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";

import FaultChat from "./FaultChat";
import AddFaultMessage from "./AddFaultMessage";
import { addMessage, getMessagesByFaultId } from "../../utils/fetchMessageFunctions";
import { useUser } from "../../utils/UserProvider";
import { isHamal } from "../../utils/roles";

interface Props {
    fault: Fault;
}

function FaultDetails({ fault }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const user = useUser();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        fetchMessages();
    }, [fault._id]);

    async function fetchMessages() {
        const newMessages = await getMessagesByFaultId(user, fault._id) as Message[];
        if (!newMessages) return enqueueSnackbar("אירעה שגיאה בקבלת הודעות", { variant: "error" });

        setMessages(newMessages);
    }

    async function _onAddMessage(name: string, content: string) {
        const message = await addMessage(user, fault._id, { content, author: { name } });
        if (!message) return enqueueSnackbar("אירעה שגיאה בהוספת הודעה", { variant: "error" });

        setMessages([...messages, message]);
        fetchMessages();
    }

    return <div className="fault-details">
        <FaultChat fault={fault} messages={messages} />
        {isHamal(user) && <AddFaultMessage addNewMessage={_onAddMessage} />}
    </div>;
}

export default React.memo(FaultDetails);