import "./index.scss";
import React, { useState, useMemo } from "react";
import { Container, Button } from "@material-ui/core";
import { useSnackbar } from "notistack";

import TextField from "../Inputs/TextField";
import DropDownInput from "../Inputs/DropDownInput";
import { useUser } from "../../utils/UserProvider";
import { categoryToText } from "../../utils/translations";
import { toSelect } from "../../utils/inputs";
import { useApi } from "../../hooks/useApi";

const CATEGORY_OPTIONS = toSelect(categoryToText);

export default function AddFault() {
  const user = useUser();
  const [fetchFaults] = useApi("/api/faults");
  const { enqueueSnackbar } = useSnackbar();
  const [isName, setIsNameValid] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isContentValid, setIsContentValid] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [category, setCategory] = useState<FaultCategory>("other");
  const [distributionCenter, setDistributionCenter] = useState(user.authGroups[0]);

  const centers = useMemo(() => user.authGroups.map(c => ({ label: c, value: c })), [user]);

  async function _addFault(newFault: NewFault) {
    const fault = await fetchFaults("", "POST", newFault);
    if (!fault) return enqueueSnackbar("חלה שגיאה בהוספת תקלה", { variant: "error" });

    enqueueSnackbar("התקלה נוספה בהצלחה", { variant: "success" });
  };

  const onAddFault = () => {
    _addFault({
      distributionCenter,
      category,
      content,
      author: { name, phone }
    });

    cleanForm();
  }

  const cleanForm = () => setContent("");

  return (
    <Container className="add-fault" maxWidth="sm">
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
    </Container>
  );
}
