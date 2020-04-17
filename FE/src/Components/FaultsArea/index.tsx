import React, { useState, useRef } from 'react';

import { useApi } from '../../hooks/useApi';

import DatePanel from '../DatePanel';
import FaultsList from './FaultsList';

const REFRESH_INTERVAL: number = 20 * 1000;

export default function FaultsArea() {
    const [faultsApi] = useApi("/api/faults");
    const [faults, setFaults] = useState<Fault[]>([]);
    const datePanelRef = useRef<DatePanel>(null);

    async function _refreshFaults(date: Date) {
        const newFaults = await faultsApi<Fault[]>({ route: `?date=${date.toISOString()}` });
        if (!newFaults) throw new Error();

        setFaults(newFaults);
    }

    async function deleteFault(id: string) {
        const fault = await faultsApi({ route: `/${id}`, method: "DELETE", successMessage: "התקלה נמחקה בהצלחה" });
        if (!fault) return;

        setFaults([...faults.filter(f => f._id !== id)]);
        datePanelRef.current?.refresh();
    };

    async function setFaultStatus(faultId: string, status: FaultStatus) {
        const newFault = await faultsApi<Fault>({ route: `/${faultId}`, method: "PUT", body: { status } });
        if (!newFault) return;

        setFaults([...faults.filter(f => f._id !== newFault._id), newFault]);
        datePanelRef.current?.refresh();
    }

    return <>
        <DatePanel ref={datePanelRef} task={_refreshFaults} interval={REFRESH_INTERVAL} />
        <FaultsList faults={faults} onFaultDelete={deleteFault} onStatusChange={setFaultStatus} />
    </>;
}