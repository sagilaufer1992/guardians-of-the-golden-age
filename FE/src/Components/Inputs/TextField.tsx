import "./TextField.scss";

import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { TextField as TextFieldCore } from "@material-ui/core";

interface Props {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isValid?: (value: string) => boolean;
}

export default function TextField(props: Props) {
  const [error, setError] = useState<boolean>(false);

  const {
    label,
    onChange,
    value,
    className,
    inputClassName,
    helperText,
    isValid,
    multiline,
    placeholder,
    rows,
  } = props;

  const mountRef = useRef<boolean>(false);

  useEffect(() => {
    if (mountRef.current) {
      if (!_validate(value) && !error) {
        setError(true);
        onChange(value, false);
      }
    } else mountRef.current = true;
  }, [value]);

  function _validate(value: string): boolean {
    return isValid ? isValid(value) : !!value?.length;
  }
  return (
    <div className={classnames("text-field", className || "")}>
      <label>{label}</label>
      <TextFieldCore
        error={error}
        value={value}
        className={inputClassName}
        variant="outlined"
        placeholder={placeholder || ""}
        rows={(multiline && rows) || undefined}
        multiline={!!multiline}
        helperText={helperText}
        onChange={(e) => {
          const { value } = e.target;
          const isValidValue = _validate(value);
          onChange(value, isValidValue);
          setError(!isValidValue);
        }}
      />
    </div>
  );
}
