import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from "moment";
import { useSnackbar } from "notistack";

import { getFaultsByDate, updateFault, addFault, deleteFault } from "../utils/fetchFaultFunctions";

const REFRESH_TIMEOUT: number = 20 * 1000;

export function useFaultManager(): FaultManager {
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useState<gg.User | null>(null);
    const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
    const [level, setLevel] = useState<Level | null>(null);
    const [levelValue, setLevelValue] = useState<string>();
    const [faults, setFaults] = useState<Fault[]>([]);
    const [faultsReport, setFaultsReport] = useState<FaultsReport>();
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const lastRefreshTime: React.MutableRefObject<Date | null> = useRef(null);
    const refreshTimeout: React.MutableRefObject<any | null> = useRef(null);

    useEffect(() => {
        // TODO: MAKE IT WORK FOR Chrome
        document.addEventListener("visibilitychange", () => {
            if (user && document.visibilityState === "visible") _refreshFaults();
        });
    }, []);

    useEffect(() => {
        if (user) _refreshFaults();
    }, [date, level, user]);

    async function _refreshFaults() {
        // can't call _refreshFaults if already refreshing - can cause bugs (change date while refresh)
        // also - stop refreshing when user is not watching
        // TODO: MAKE IT WORK FOR MOBILE
        if (isRefresh || document.hidden) return;

        setIsRefresh(true);
        if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

        const newFaults = await getFaultsByDate(user!, date);

        if (!newFaults) enqueueSnackbar("אירעה שגיאה בעדכון התקלות", { variant: "error" });
        else {
            setFaults(newFaults);
            lastRefreshTime.current = new Date();
        }

        refreshTimeout.current = setTimeout(_refreshFaults, REFRESH_TIMEOUT);
        setIsRefresh(false);
    }

    async function internalAddFault(newFault: NewFault) {
        const fault = await addFault(user!, newFault);
        if (!fault) return enqueueSnackbar("חלה שגיאה בהוספת תקלה", { variant: "error" });

        enqueueSnackbar("התקלה נוספה בהצלחה", { variant: "success" });
        setFaults([...faults, fault]);
        _refreshFaults();
    };

    async function internalDeleteFault(id: string) {
        const fault = await deleteFault(user!, id);
        if (!fault) return enqueueSnackbar("חלה שגיאה מחיקת תקלה", { variant: "error" });

        enqueueSnackbar("התקלה נמחקה בהצלחה", { variant: "success" });
        setFaults([...faults.filter(f => f._id !== id)]);
        _refreshFaults();
    };

    async function setFaultStatus(faultId: string, status: FaultStatus) {
        const newFault = await updateFault(user!, faultId, { status });
        if (!newFault) return enqueueSnackbar("חלה שגיאה בעדכון תקלה", { variant: "error" });

        setFaults([...faults.filter(f => f._id !== newFault._id), newFault]);
        _refreshFaults();
    }

    return {
        faults,
        isRefresh,
        lastRefreshTime: lastRefreshTime.current,
        level,
        setDate,
        setLevel,
        setLevelValue,
        setUser,
        addFault: internalAddFault,
        deleteFault: internalDeleteFault,
        setFaultStatus
    }
}