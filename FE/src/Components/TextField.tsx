import React from "react";
import { TextField as TextFieldCore } from "@material-ui/core";

interface Props {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export default function TextField(props: Props) {
  const {
    label,
    onChange,
    value,
    className,
    multiline,
    placeholder,
    rows,
  } = props;
  return (
    <>
      <label>{label}</label>
      <TextFieldCore
        value={value}
        className={className}
        variant="outlined"
        placeholder={placeholder || ""}
        rows={(multiline && rows) || undefined}
        multiline={!!multiline}
        onChange={(e) => onChange(e.target.value, false)}
      />
    </>
  );
}
