import "./index.scss";

import React, { useState, useEffect } from 'react';
import moment from "moment";

import FaultsArea from "./FaultsArea";
import DatePanel from "./DatePanel";

interface Props {
    faultManager: any,
}

export default function ManageFaults({ faultManager }: Props) {
    const [date, setDate] = useState<Date>(moment().startOf('day').toDate());

    useEffect(() => faultManager.setDate(date), [date]);

    return <div className="faults-panel">
        <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />
        <FaultsArea faults={faultManager.faults} onStatusChange={faultManager.setFaultStatus} onFaultDelete={faultManager.deleteFault} />
    </div>;
}