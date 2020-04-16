import "./index.scss";

import React, { useState, useEffect } from 'react';
import moment from "moment";

import { useMediaQuery, Theme } from '@material-ui/core';
import FaultsArea from "./FaultsArea";
import DatePanel from "./DatePanel";

interface Props {
    faultManager: any,
}

export default function ManageFaults({ faultManager }: Props) {
    const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
    const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

    useEffect(() => faultManager.setDate(date), [date]);

    return <div className="app-content">
        <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />
        <FaultsArea faults={faultManager.faults} onStatusChange={faultManager.setFaultStatus} onFaultDelete={faultManager.deleteFault} />
    </div>;
}