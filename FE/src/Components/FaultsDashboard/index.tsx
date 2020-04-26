import "./index.scss";

import React, { useState, useRef, useEffect } from 'react';
import { Container, useMediaQuery, Theme } from '@material-ui/core';

import { useApi } from '../../hooks/useApi';
import { AppRouteProps } from '../../routesConfig';

import DatePanel from '../DatePanel';
import FaultsList from './FaultsList';
import FaultsStatus from "./FaultsStatus";

const REFRESH_INTERVAL: number = 20 * 1000;

export default function FaultsArea({ date, setDate, levelAndValue }: AppRouteProps) {
    const [faultsApi] = useApi("/api/faults", { parseDate: true });
    const [fetchFaultsReport] = useApi("/api/faults/status");
    const [faults, setFaults] = useState<Fault[]>([]);
    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);

    const datePanelRef = useRef<DatePanel>(null);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    useEffect(() => { _refreshFaults(date) }, [levelAndValue]);

    async function _refreshFaults(date: Date) {
        const { level, value: levelValue } = levelAndValue;
        const params = `?level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date.toISOString()}`;

        const [newFaults, newReport] = await Promise.all([
            faultsApi<Fault[]>({ route: params }),
            fetchFaultsReport<FaultsReport>({ route: params }),
        ]);

        if (!newFaults || !newReport) throw new Error();

        setFaults(newFaults);
        setFaultsReport(newReport);
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

    return <div className="faults-dashboard-container">
        <DatePanel ref={datePanelRef} date={date} setDate={setDate} task={_refreshFaults} interval={REFRESH_INTERVAL} />
        <div className="faults-dashboard">
            <FaultsList faults={faults} onFaultDelete={deleteFault} onStatusChange={setFaultStatus} />
            {faultsReport && !isMobile && <Container maxWidth="sm"><FaultsStatus report={faultsReport} /></Container>}
        </div>
    </div>;
}