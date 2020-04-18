import React, { useState, useRef } from 'react';
import { Container } from '@material-ui/core';

import { useApi } from '../../hooks/useApi';
import { AppRouteProps } from '../../routesConfig';

import DatePanel from '../DatePanel';
import FaultsList from './FaultsList';

const REFRESH_INTERVAL: number = 20 * 1000;

export default function FaultsArea({ date, setDate }: AppRouteProps) {
    const [faultsApi] = useApi("/api/faults", { parseDate: true });
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

    return <Container className="faults-area-container" maxWidth="md">
        <DatePanel ref={datePanelRef} date={date} setDate={setDate} task={_refreshFaults} interval={REFRESH_INTERVAL} />
        <FaultsList faults={faults} onFaultDelete={deleteFault} onStatusChange={setFaultStatus} />
    </Container>;
}