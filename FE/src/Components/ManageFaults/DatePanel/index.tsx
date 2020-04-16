import React from "react";
import moment from "moment";
import { CircularProgress, Hidden } from '@material-ui/core';

import DatePicker from "./DatePicker";

interface Props {
    isRefresh: boolean;
    lastRefreshTime: Date | null;
    onDateChanged: (date: Date) => void;
}

export default function DatePanel({ isRefresh, lastRefreshTime, onDateChanged }: Props) {
    return <div className="date-panel">
        <DatePicker onDateChanged={onDateChanged} />
        <Hidden smDown>
            {isRefresh && <CircularProgress className="fault-fetch-progress" size={15} thickness={5} />}
            {lastRefreshTime && <div className="last-fault-update">עודכן לאחרונה ב- {moment(lastRefreshTime).format("HH:mm DD/MM/YYYY")}</div>}
        </Hidden>
    </div>;
}