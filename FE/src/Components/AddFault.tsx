import "./AddFault.scss";
import React, { useState, useContext, useMemo } from "react";
import { Button } from "@material-ui/core";
import TextField from "./TextField";
import Select from "./Select";
import UserProvider from "../utils/UserProvider";
import { categoryToText } from "../utils/translations";
import { toSelect } from "../utils/inputs";

const CATEGORY_OPTIONS = toSelect(categoryToText);

interface Props {
  onFaultAdded: (fault: NewFault) => void;
}

export default function AddFault(props: Props) {
  const user = useContext(UserProvider);
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [category, setCategory] = useState<FaultCategory>("other");
  const [distributionCenter, setDistributionCenter] = useState(user.authGroups[0]);

  const centers = useMemo(() => user.authGroups.map(c => ({ label: c, value: c })), [user]);

  const onAddFault = () => {
    if (!name || !phone || !content) return alert("אנא מלא שם, טלפון ותיאור");

    props.onFaultAdded({
      distributionCenter,
      category,
      content,
      author: { name, phone }
    });
    cleanForm();
  }

  const cleanForm = () => setContent("");

  return (
    <div className="add-fault">
      <div className="title">צור תקלה חדשה</div>
      <div className="fields">
        <div className="fault-field row">
          <div className="inline-field">
            <TextField label="שם מלא" onChange={(value, isValid) => setName(value)} value={name} />
          </div>
          <div className="inline-field">
            <TextField label="טלפון" onChange={(value, isValid) => setPhone(value)} value={phone} />
          </div>
        </div>
        <div className="fault-field">
          <label>נקודת חלוקה</label>
          <Select
            onChange={setDistributionCenter}
            options={centers}
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
        <div className="fault-field">
          <TextField 
            label="תיאור הבעיה"
            onChange={(value, isValid) => setContent(value)} 
            value={content} 
            className="fault-input"
            multiline
            placeholder="הזן פרטים על התקלה"
            rows={4}
          />
        </div>
      </div>
      <div className="buttons">
        <Button className="approve" onClick={onAddFault}>אישור</Button>
        <Button className="cancel" onClick={cleanForm}>נקה</Button>
      </div>
    </div>
  );
}
