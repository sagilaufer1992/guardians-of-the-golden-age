import React, { useState, useContext } from "react";
import { Button, TextField } from "@material-ui/core";
import Select from "./Select";
import UserProvider from "../utils/UserProvider";
import "./AddFault.scss";

const DISTRIBUTION_CENTER_OPTIONS = [
    { label: "בחר נקודת חלוקה...", value: "" },
    { label: "מתנס אבו גוש", value: "מתנס אבו גוש" },
    { label: "מרכזית המפרץ", value: "מרכזית המפרץ" },
];

const CATEGORY_OPTIONS = [
    { label: "food", value: "food" },
    { label: "drugs", value: "drugs" },
    { label: "other", value: "other" },
];

interface Props {
    onFaultAdded: (user: gg.User | null, fault: Partial<Fault>) => void;
}

export default function AddFault(props: Props) {
    const user = useContext(UserProvider);
    const [content, setContent] = useState<string>("");
    const [category, setCategory] = useState<FaultCategory>("other");
    const [distributionCenter, setDistributionCenter] = useState("");

    const onAddFault = () => {
        props.onFaultAdded(user, {
            distributionCenter,
            content,
            category
        });
    }

    const cleanForm = () => {
        setContent("");
        setCategory("other");
        setDistributionCenter("");
    }

    return (
        <form className="add-fault">
            <div className="title">צור תקלה חדשה</div>
            <div className="fields">
                <div className="fault-field">
                    <label>תיאור הבעיה</label>
                    <TextField
                        className="fault-input"
                        variant="outlined"
                        placeholder="הזן פרטים על התקלה"
                        rows={4}
                        multiline
                        onChange={e => setContent(e.target.value)} />
                </div>
                <div className="fault-field">
                    <label>נקודת חלוקה</label>
                    <Select
                        onChange={setDistributionCenter}
                        options={DISTRIBUTION_CENTER_OPTIONS}
                        title=""
                        value={distributionCenter}
                    />
                </div>
                <div className="fault-field">
                    <label>קטגוריה</label>
                    <Select
                        onChange={value => setCategory(value as FaultCategory)}
                        options={CATEGORY_OPTIONS}
                        title=""
                        value={category}
                    />
                </div>
            </div>
            <div className="buttons">
                <Button className="approve" onClick={onAddFault}>אישור</Button>
                <Button className="cancel" onClick={cleanForm}>נקה</Button>
            </div>
        </form>
    );
}
