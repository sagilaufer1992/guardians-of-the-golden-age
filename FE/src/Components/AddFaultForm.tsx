import React, { useState, useContext } from "react";
import { Button, TextField } from "@material-ui/core";
import Select from "./Select";
import UserProvider from "../utils/UserProvider";
import "./AddFaultForm.scss";

interface Props {
  onApprove: () => void;
  onCancel: () => void;
}

export default function AddFaultForm(props: Props) {
  const user = useContext(UserProvider);
  const { onApprove, onCancel } = props;
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState("other");
  const [distributionCenter, setDistributionCenter] = useState("");

  return (
    <form className="add-fault-form">
      <div className="fields">
        <div>
          <span>תיאור הבעיה</span>
          <TextField
            multiline
            onChange={(e) => setContent(e.target.value)}
          ></TextField>
        </div>
        <div className="selection">
          <span>נקודת חלוקה</span>
          <Select
            onChange={setDistributionCenter}
            options={[
              { label: "בחר נקודת חלוקה...", value: "" },
              { label: "מתנס אבו גוש", value: "מתנס אבו גוש" },
              { label: "מרכזית המפרץ", value: "מרכזית המפרץ" },
            ]}
            title=""
            value={distributionCenter}
          ></Select>
        </div>
        <div className="selection">
          <span>קטגוריה</span>
          <Select
            onChange={setCategory}
            options={[
              { label: "food", value: "food" },
              { label: "drugs", value: "drugs" },
              { label: "other", value: "other" },
            ]}
            title=""
            value={category}
          ></Select>
        </div>
      </div>
      <div className="buttons">
        <Button
          className="approve"
          onClick={() => {
            fetch(process.env.REACT_APP_BE + "/api/fault", {
              method: "POST",
              mode: "cors",
              headers: {
                "Contetn-Type": "application/json",
              },
              body: JSON.stringify({
                author: {
                  name: user?.username,
                  role: user?.role,
                },
                distributionCenter,
                content,
                category,
              }),
            });
            onApprove();
          }}
        >
          אישור
        </Button>
        <Button className="cancel" onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </form>
  );
}
