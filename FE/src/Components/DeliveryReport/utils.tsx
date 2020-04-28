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

interface Props {
    total: number;
    current: number;
    failed?: number;
}

export function ProgressBar({ total, current, failed = 0 }: Props) {
    const deliveryPercentage = Math.round(current / total * 100);
    const failedPercentage = Math.round(failed / total * 100);

    return <div className="bar-content">
        <span>התקדמות החלוקה להיום</span>
        <div className="status-bar">
            {current > 0 && <span className="delivered" style={{ width: `${deliveryPercentage}%`}} />}
            {failed > 0 && <span className="failed" style={{ width: `${failedPercentage}%`}} />}
        </div>
        <span>
            תכנון: {total} אנשים
            | בוצע: {isNaN(current) ? 0 : current}
            {failed > 0 && <> | נכשל: {failed} </>}
        </span>
    </div>
}