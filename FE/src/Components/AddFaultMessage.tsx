import "./AddFaultMessage.scss";

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "./TextField";

interface Props {
    addNewMessage: (name: string, content: string) => void;
}

export default function AddFaultMessage({ addNewMessage }: Props) {
    const [name, setName] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isNameValid, setIsNameValid] = useState<boolean>(false);
    const [isContentValid, setIsContentValid] = useState<boolean>(false);

    function _onSumbit() {
        addNewMessage(name, content);
        setName("");
        setContent("");
    }

    return <div className="add-message-panel">
        <div className="panel-label">פרטי הטיפול</div>
        <div className="panel-body">
            <TextField 
                label="שם המדווח על הטיפול בתקלה"
                onChange={(value, isValid) => {
                    setName(value);
                    setIsNameValid(isValid);
                }}
                value={name} 
                className="panel-input"
                placeholder="השם המלא לצורך תיעוד" />
            <TextField 
                label="אופן הטיפול"
                onChange={(value, isValid) => {
                    setContent(value);
                    setIsContentValid(isValid);
                }}
                value={content} 
                className="panel-input"
                placeholder="מה הצעדים שננקטו? שים לב, ההודעה תישלח למדווח הבעיה" />
            <Button disabled={!(isNameValid && isContentValid)} onClick={_onSumbit} className="panel-button" variant="contained" size="small" color="primary">פרסם</Button>
        </div>
    </div>
}