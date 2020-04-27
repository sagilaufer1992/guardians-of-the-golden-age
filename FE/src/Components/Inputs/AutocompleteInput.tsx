import React from "react";
import { TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

export interface Option {
    value: string;
    label: string;
}

interface Props {
    title: string;
    defaultValue: string;
    options: Option[];
    disabled?: boolean;
    className?: string;
    freeSolo?: boolean;
    onChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    onClick?: () => void;
}

export default function DropDownInput(props: Props) {
    const { className, disabled, title, options, freeSolo, onChange, onInputChange, onClick } = props;

    const defaultValue = options.find(option => option.value === props.defaultValue);

    return <Autocomplete disableClearable
        disabled={disabled}
        className={className}
        defaultValue={defaultValue}
        options={options}
        freeSolo={freeSolo}
        onChange={!onChange ? undefined : (_: any, value: any) => onChange(value?.value)}
        onInputChange={!onInputChange ? undefined : (_: any, value: any) => onInputChange(value)}
        onClick={onClick}
        getOptionLabel={(option) => option.label}
        renderInput={(params: any) => (<TextField {...params} label={title} variant="outlined" />)} />
}