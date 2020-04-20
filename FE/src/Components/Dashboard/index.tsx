import "./index.scss";

import React, { useState, useEffect } from "react";
import { Container, Dialog, DialogContent, DialogTitle, Button, DialogClassKey } from "@material-ui/core";

import { useApi } from "../../hooks/useApi";
import { AppRouteProps } from "../../routesConfig";
import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";
import DatePanel from "../DatePanel";
import HierarchyNavigator from "../HierarchyNavigator";

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

const REFRESH_INTERVAL: number = 30 * 1000;

const LEVEL_KEY = "dashboard_level";
const LEVEL_VALUE_KEY = "dashboard_level_value";

export default React.memo(function Dashboard({ date, setDate }: AppRouteProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [level, setLevel] = useState<Level | null>(null);
    const [levelValue, setLevelValue] = useState<string | null>(null);
    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);
    const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null);

    const [fetchFaultsReport] = useApi("/api/faults/status");
    const [fetchDeliveryReports] = useApi("/api/dailyReports");

    useEffect(() => {
        const level = window.localStorage.getItem(LEVEL_KEY);
        if (level) setLevel(level as Level);

        const levelValue = window.localStorage.getItem(LEVEL_VALUE_KEY);
        if (levelValue) setLevelValue(levelValue);
    }, [])

    useEffect(() => setModalOpen(!!!level), [level]);

    const onInitialize = (level: Level, value: string | null) => {
        if (value) {
            setLevelValue(value);
            window.localStorage.setItem(LEVEL_VALUE_KEY, value);
        }

        const levelOrDefault = level || "national";

        setLevel(levelOrDefault);
        window.localStorage.setItem(LEVEL_KEY, levelOrDefault);
    }

    async function _refreshReports(date: Date) {
        const params = `?level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date.toISOString()}`;
        const [newFaultsReport, newDeliveryReports] = await Promise.all([
            fetchFaultsReport<FaultsReport>({ route: params }),
            fetchDeliveryReports<DeliveryReport[]>({ route: params })
        ]);

        if (!newFaultsReport && !newDeliveryReports) throw new Error();

        newFaultsReport && setFaultsReport(newFaultsReport);
        newDeliveryReports && setDeliveryReports(newDeliveryReports);
    }

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => {
        if (!level) setLevel("national");
        setModalOpen(false);
    }

    const InitModal = () => <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="lg">
        <DialogTitle>בחר היררכיה</DialogTitle>
        <DialogContent style={{ width: 400 }}>
            <Initializer onInitialize={onInitialize} />
        </DialogContent>
    </Dialog>;

    return <Container className="dashboard-container" maxWidth="xl">
        <div className="hierarchy-container">
            <Button variant="contained" color="primary" onClick={handleModalOpen} className="modal-button">שנה היררכיה</Button>
            <HierarchyNavigator level={level} levelValue={levelValue} />
        </div>
        {level && <>
            <DatePanel date={date} setDate={setDate} task={_refreshReports} interval={REFRESH_INTERVAL} />
            <div className="dashboard">
                {deliveryReports && <DeliveryStatus reports={deliveryReports} />}
                {faultsReport && <FaultsStatus report={faultsReport} />}
            </div>
        </>}
        <InitModal />
    </Container>;
});
