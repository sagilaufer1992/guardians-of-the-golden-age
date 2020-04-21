import "./index.scss";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Container, Dialog, DialogContent, DialogTitle, Button } from "@material-ui/core";
import moment from "moment";

import { useApi } from "../../hooks/useApi";
import { AppRouteProps } from "../../routesConfig";
import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";
import DatePanel from "../DatePanel";
import HierarchyNavigator from "./HierarchyNavigator";
import { useUser } from "../../utils/UserProvider";
import { isHamal } from "../../utils/roles";

const TEST_DELIVERY_REPORTS: DeliveryReport[] = [{
    name: "מקום חשוב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}];

interface LevelAndValue {
    level: Level;
    value: string | null;
}

const REFRESH_INTERVAL: number = 30 * 1000;

const LEVEL_KEY = "dashboard_level";
const LEVEL_VALUE_KEY = "dashboard_level_value";

export default function Dashboard({ date, setDate }: AppRouteProps) {
    const user = useUser();
    const [levelAndValue, setLevelAndValue] = useState<LevelAndValue>({
        level: (window.localStorage.getItem(LEVEL_KEY) as Level) ?? "national",
        value: window.localStorage.getItem(LEVEL_VALUE_KEY) ?? null
    });

    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);
    const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const datePanelRef = useRef<DatePanel>(null);

    const [fetchFaultsReport] = useApi("/api/faults/status");
    const [fetchDeliveryReports] = useApi("/api/dailyReports");

    useEffect(() => { datePanelRef.current?.refresh() }, [levelAndValue]);

    const onHierarchyChanged = (level: Level, value: string | null) => {
        if (value) window.localStorage.setItem(LEVEL_VALUE_KEY, value);
        else window.localStorage.removeItem(LEVEL_VALUE_KEY);

        window.localStorage.setItem(LEVEL_KEY, level);

        setLevelAndValue({ level, value });

        setModalOpen(false);
    }

    const _refreshReports = useCallback(async (date: Date) => {
        const { level, value: levelValue } = levelAndValue;
        const params = `?level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date.toISOString()}`;
        const [newFaultsReport, newDeliveryReports] = await Promise.all([
            fetchFaultsReport<FaultsReport>({ route: params }),
            fetchDeliveryReports<DeliveryReport[]>({ route: params })
        ]);

        if (!newFaultsReport && !newDeliveryReports) throw new Error();

        newFaultsReport && setFaultsReport(newFaultsReport);
        newDeliveryReports && setDeliveryReports(newDeliveryReports);
    }, [date, levelAndValue]);

    const onExpectedFileUploaded = () => {
        datePanelRef.current?.refresh();
    }

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    return <Container className="dashboard-container" maxWidth="xl">
        <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="lg">
            <DialogTitle>בחר היררכיה</DialogTitle>
            <DialogContent style={{ width: 400 }}>
                <Initializer onInitialize={onHierarchyChanged} />
            </DialogContent>
        </Dialog>
        <DatePanel ref={datePanelRef}
            date={date}
            setDate={setDate}
            task={_refreshReports}
            interval={REFRESH_INTERVAL}
            loadExpectedReports={isHamal(user) && (!!deliveryReports && deliveryReports.length === 0 || _isFutureDate(date))}
            onExpectedFileUploaded={onExpectedFileUploaded} />
        <div className="hierarchy-container">
            <Button variant="contained" color="primary" onClick={handleModalOpen} className="modal-button">שנה היררכיה</Button>
            <HierarchyNavigator levelAndValue={levelAndValue} onHierarchyChanged={onHierarchyChanged} />
        </div>
        <div className="dashboard">
            {deliveryReports && <DeliveryStatus reports={deliveryReports} />}
            {faultsReport && <FaultsStatus report={faultsReport} />}
        </div>
    </Container>;
};

function _isFutureDate(date: Date) {
    return moment(date).diff(new Date(), "days") > 0;
}
