import "./TextField.scss";

import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { TextField as TextFieldCore } from "@material-ui/core";

interface Props {
  value: number;
  onChange: (value: number, isValid: boolean) => void;
  label: string;
  min: number;
  max: number;
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isValid?: (value: number) => boolean;
}

export default function NumberInput(props: Props) {
  const [error, setError] = useState<boolean>(false);

  const {
    disabled,
    label,
    onChange,
    value,
    className,
    inputClassName,
    helperText,
    isValid,
    placeholder,
    min,
    max,
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

  function _validate(value: number): boolean {
    return (isValid ? isValid(value) : Number.isInteger(value)) && value <= max && value >= min;
  }

  return (
    <div className={classnames("text-field", className || "")}>
      <label>{label}</label>
      <TextFieldCore
        type="number"
        disabled={disabled}
        InputProps={{
          inputProps: {
            max: isNaN(max) ? 0 : max,
            min: isNaN(min) ? 0 : min,
          }
        }}
        error={error}
        value={value}
        className={inputClassName}
        variant="outlined"
        placeholder={placeholder || ""}
        helperText={helperText}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          const isValidValue = _validate(value);
          onChange(value, isValidValue);
          setError(!isValidValue);
        }}
      />
    </div>
  );
}
