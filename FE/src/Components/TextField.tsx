import React, { useState, useEffect, useRef } from "react";
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
  isValid?: (value: string) => boolean;
}

export default function TextField(props: Props) {
  const [error, setError] = useState<boolean>(false);

  const {
    label,
    onChange,
    value,
    className,
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
    <>
      <label>{label}</label>
      <TextFieldCore
        error={error}
        value={value}
        className={className}
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
    </>
  );
}
