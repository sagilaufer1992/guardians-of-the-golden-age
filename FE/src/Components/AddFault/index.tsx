import "./index.scss";
import React, { useState, useContext, useMemo } from "react";
import { Button } from "@material-ui/core";
import TextField from "../Inputs/TextField";
import DropDownInput from "../Inputs/DropDownInput";
import UserProvider from "../../utils/UserProvider";
import { categoryToText } from "../../utils/translations";
import { toSelect } from "../../utils/inputs";

const CATEGORY_OPTIONS = toSelect(categoryToText);

interface Props {
  onFaultAdded: (fault: NewFault) => void;
}

export default function AddFault(props: Props) {
  const user = useContext(UserProvider);
  const [isName, setIsNameValid] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isContentValid, setIsContentValid] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [category, setCategory] = useState<FaultCategory>("other");
  const [distributionCenter, setDistributionCenter] = useState(user.authGroups[0]);

  const centers = useMemo(() => user.authGroups.map(c => ({ label: c, value: c })), [user]);

  const onAddFault = () => {
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
        <div className="user-details fault-field row">
          <TextField
            className="name-field"
            label="שם מלא"
            onChange={(value, isValid) => {
              setIsNameValid(isValid);
              setName(value);
            }}
            value={name} />
          <TextField
            className="phone-field"
            label="טלפון"
            onChange={(value, isValid) => {
              setIsPhoneValid(isValid);
              setPhone(value);
            }}
            value={phone}
            isValid={(value: string) => {
              return !!value.match(/\d{10}/)?.length && value.length === 10 && value.startsWith("05")
            }} />
        </div>
        <div className="fault-field">
          <label>נקודת חלוקה</label>
          <DropDownInput
            onChange={setDistributionCenter}
            options={centers}
            title=""
            defaultValue={distributionCenter}
          />
        </div>
        <div className="fault-field">
          <label>קטגוריה</label>
          <DropDownInput
            onChange={value => setCategory(value as FaultCategory)}
            options={CATEGORY_OPTIONS}
            title=""
            defaultValue={category}
          />
        </div>
        <div className="fault-field">
          <TextField
            label="תיאור הבעיה"
            onChange={(value, isValid) => {
              setIsContentValid(isValid);
              setContent(value);
            }}
            value={content}
            inputClassName="fault-content"
            multiline
            placeholder="הזן פרטים על התקלה"
            rows={4}
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          disabled={!(isContentValid && isName && isPhoneValid)}
          size="small" color="primary" variant="contained"
          onClick={onAddFault}>
          אישור
        </Button>
        <Button className="clean-button" onClick={cleanForm}>נקה</Button>
      </div>
    </div>
  );
}
