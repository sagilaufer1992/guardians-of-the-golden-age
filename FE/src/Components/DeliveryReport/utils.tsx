import "./utils.scss";

import React from "react";
import { Button, withStyles, LinearProgress } from '@material-ui/core';

export const ColorButton = withStyles(() => ({
    root: {
        backgroundColor: "#ffdb0a",
        '&:hover': {
            backgroundColor: "#fbbf00",
        },
    },
}))(Button);

const Bar = withStyles(() => ({
    root: {
        height: 30,
        backgroundColor: '#ddd',
    },
    bar: {
        backgroundColor: '#007aff',
    },
}))(LinearProgress);

interface Props {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: Props) {
    const percentage = Math.round(current / total * 100);

    return <div className="bar-content">
        <span>התקדמות החלוקה להיום</span>
        {/* <div className="precentage">{isNaN(percentage) ? 0 : percentage}%</div> */}
        <Bar variant="determinate" value={percentage}/>
        <span>
            תכנון: {total} מנות
            | חולקו: {isNaN(current) ? 0 : current} מנות
        </span>
    </div>
}