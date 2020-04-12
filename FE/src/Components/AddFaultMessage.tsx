import "./AddFaultMessage.scss";

import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

interface Props {
    addNewMessage: (name: string, content: string) => void;
}

export default function AddFaultMessage({ addNewMessage }: Props) {
    const [name, setName] = useState<string>("");
    const [content, setContent] = useState<string>("");

    function _onSumbit() {
        if (name !== "" && content !== "") {
            addNewMessage(name, content);
            setName("");
            setContent("");
        }
    }

    function _onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function _onContentChange(e: React.ChangeEvent<HTMLInputElement>) {
        setContent(e.target.value);
    }

    return <div className="add-message-panel">
        <div className="panel-label">פרטי הטיפול</div>
        <div className="panel-body">
            <div className="input-label">שם המדווח על הטיפול בתקלה</div>
            <TextField className="panel-input" variant="outlined" value={name} onChange={_onNameChange} placeholder="שם המלא לצורך תיעוד" />
            <div className="input-label">אופן הטיפול</div>
            <TextField className="panel-input" variant="outlined" value={content} onChange={_onContentChange} multiline rows={4} placeholder="מה הצעדים שננקטו? שים לב, ההודעה תישלח למדווח הבעיה" />
            <Button onClick={_onSumbit} className="panel-button" variant="contained" size="small" color="primary">פרסם</Button>
        </div>
    </div>
}