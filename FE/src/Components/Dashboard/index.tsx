import "./index.scss";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Container, Dialog, DialogContent, DialogTitle, Button, Hidden } from "@material-ui/core";

import { useApi } from "../../hooks/useApi";
import { AppRouteProps } from "../../routesConfig";
import { dayDifference } from "../../utils/dates";

import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";
import DatePanel from "../DatePanel";
import HierarchyNavigator from "./HierarchyNavigator";
import UploadDeliveryFile from "./UploadDeliveryFile";

const TEST_DELIVERY_REPORTS: DeliveryReport[] = [{
    name: "רחובות",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
}, {
    name: "ראשון לציון - מערב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
}, {
    name: "מקום חשוב",
    expected: 400,
    actual: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
}, {
    name: "ירושלים והמרכז ומחוצה לו ולתמיד",
    expected: 400,
    actual: 500,
    delivered: 334,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
}];

interface LevelAndValue {
    level: Level;
    value: string | null;
}

const REFRESH_INTERVAL: number = 30 * 1000;

const LEVEL_KEY = "dashboard_level";
const LEVEL_VALUE_KEY = "dashboard_level_value";

const HIERARCHY_LEVELS_ORDER: Level[] = ["national", "district", "napa", "municipality"]

export default function Dashboard({ date, setDate }: AppRouteProps) {
    const [levelAndValue, setLevelAndValue] = useState<LevelAndValue>({
        level: (window.localStorage.getItem(LEVEL_KEY) as Level) ?? "national",
        value: window.localStorage.getItem(LEVEL_VALUE_KEY) ?? null
    });

    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);
    const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [hideEmpty, setHideEmpty] = useState<boolean>(false);
    const datePanelRef = useRef<DatePanel>(null);

    const [fetchFaultsReport] = useApi("/api/faults/status");
    const [fetchDeliveryReports] = useApi("/api/dailyReports");

    const showUpload = useMemo(() => dayDifference(date, new Date()) >= 0, [date]);

    useEffect(() => { datePanelRef.current?.refresh() }, [levelAndValue, hideEmpty]);

    const onHierarchyChanged = (level: Level, value: string | null) => {
        if (value) window.localStorage.setItem(LEVEL_VALUE_KEY, value);
        else window.localStorage.removeItem(LEVEL_VALUE_KEY);

        window.localStorage.setItem(LEVEL_KEY, level);

        setLevelAndValue({ level, value });

        setModalOpen(false);
    }

    const _refreshReports = useCallback(async (date: Date) => {
        const { level, value: levelValue } = levelAndValue;
        const params = `?level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date.toISOString()}&hideEmpty=${hideEmpty}`;
        const [newFaultsReport, newDeliveryReports] = await Promise.all([
            fetchFaultsReport<FaultsReport>({ route: params }),
            fetchDeliveryReports<DeliveryReport[]>({ route: params })
        ]);

        if (!newFaultsReport && !newDeliveryReports) throw new Error();

        newFaultsReport && setFaultsReport(newFaultsReport);
        newDeliveryReports && setDeliveryReports(newDeliveryReports);
    }, [date, levelAndValue, hideEmpty]);

    const onExpectedFileUploaded = () => { datePanelRef.current?.refresh(); };

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const onDeliveryReportClick = (value: string) => {
        const levelIndex = HIERARCHY_LEVELS_ORDER.findIndex(level => level === levelAndValue.level);

        if (levelIndex === -1 || levelIndex >= HIERARCHY_LEVELS_ORDER.length - 1 || levelAndValue.value === value) return;

        onHierarchyChanged(HIERARCHY_LEVELS_ORDER[levelIndex + 1], value);
    }

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
            interval={REFRESH_INTERVAL} />
        <div className="actions-container">
            <div className="hierarchy-container">
                <Button variant="contained" color="primary" onClick={handleModalOpen} className="modal-button">שנה היררכיה</Button>
                <HierarchyNavigator levelAndValue={levelAndValue} onHierarchyChanged={onHierarchyChanged} />
            </div>
            {deliveryReports && showUpload && <Hidden smDown>
                <UploadDeliveryFile title="העלה נתוני חלוקה עבור יום זה" date={date} onUploaded={onExpectedFileUploaded} />
            </Hidden>}
        </div>
        <div className="dashboard">
            {deliveryReports && <DeliveryStatus
                hideEmpty={hideEmpty}
                setHideEmpty={setHideEmpty}
                level={levelAndValue.level}
                reports={deliveryReports}
                onDeliveryReportClick={onDeliveryReportClick} />}            
        </div>
    </Container>;
};
