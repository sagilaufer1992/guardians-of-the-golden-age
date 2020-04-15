import React from "react";
import { TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";

interface Option {
    value: string;
    label: string;
}

interface Props {
    title: string;
    defaultValue: string;
    options: Option[];
    onChange: (value: string) => void;
}

export default function DropDownInput(props: Props) {
    const { title, options, onChange } = props;

    const handleChange = (e: any, value: any) => onChange(value?.value);

    const defaultValue = options.find(option => option.value === props.defaultValue);

    return <Autocomplete disableClearable
        defaultValue={defaultValue}
        options={options}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params: any) => (<TextField {...params} label={title} variant="outlined" />)} />
}