import "./AddFaultMessage.scss";

import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

interface Props {
    setNewMessage: (message: Message) => void;
}

interface Message {
    name: string;
    treatment: string;
}

export default function AddFaultMessage({ setNewMessage }: Props) {
    const [name, setName] = useState<string>("");
    const [treatment, setTreatment] = useState<string>("");

    function _onSumbit() {
        if (name !== "" && treatment !== "") {
            setNewMessage({name, treatment});
            setName("");
            setTreatment("");
        }
    }

    function _onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function _onTreatmentChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTreatment(e.target.value);
    }

    return <div className="add-message-panel">
        <div className="panel-label">פרטי הטיפול</div>
        <div className="panel-body">
            <div className="input-label">שם המדווח על הטיפול בתקלה</div>
            <TextField className="panel-input" variant="outlined" value={name} onChange={_onNameChange} placeholder="שם המלא לצורך תיעוד" />
            <div className="input-label">אופן הטיפול</div>
            <TextField className="panel-input" variant="outlined" value={treatment} onChange={_onTreatmentChange} multiline rows={4} placeholder="מה הצעדים שננקטו? שים לב, ההודעה תישלח למדווח הבעיה" />
            <Button onClick={_onSumbit} className="panel-button" variant="contained" size="small" color="primary">סמן כטופל</Button>
        </div>
    </div>
}