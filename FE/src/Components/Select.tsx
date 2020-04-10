import "./Select.scss";

import React, { useState } from "react";

import ArrowIcon from "@material-ui/icons/ArrowDropDown"
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface Option {
    value: string;
    label: string;
}

interface Props {
    onChange: (value: string) => void;
    value: string;
    title: string;
    options: Option[];
}

export default function Select({ onChange, value, title, options }: Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    function _onChange(v: string) {
        setAnchorEl(null);
        onChange(v);
    }

    return <div className="select-group">
        <div className="select-label">{title}</div>
        <Button className="select" variant="outlined" color="default" onClick={(event) => setAnchorEl(event.currentTarget)}>
            {getLabel(options, value)}
            <ArrowIcon />
        </Button>
        <Menu anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}>
            {options.map(({ value, label }) => <MenuItem key={value} value={value} onClick={() => _onChange(value)}>
                {label}
            </MenuItem>)}
        </Menu>
    </div>
}

function getLabel(options: Option[], value: string) {
    const option = options.find(option => option.value === value);

    if (option) return option.label
    return "";
}