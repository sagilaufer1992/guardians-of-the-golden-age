import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

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

export default function DropDownInput({ onChange, defaultValue, title, options }: Props) {
    const handleChange = (e: any) => {
        onChange(e.target.value);
    };

    return <FormControl variant="outlined" >
        <InputLabel>{title}</InputLabel>
        <Select
            defaultValue={defaultValue}
            onChange={handleChange}
            label={title}>
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
}