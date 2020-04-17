import "./index.scss";

import React, { useState } from "react";

import { useApi } from "../../hooks/useApi";
import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";
import DatePanel from "../DatePanel";

const TEST_DELIVERY_REPORTS: DeliveryReport[] = [{
    name: "מקום חשוב",
    total: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, failed: 30 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    total: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, failed: 30 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    total: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, failed: 30 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}, {
    name: "מקום חשוב",
    total: 400,
    delivered: 234,
    deliveryFailed: 40,
    deliveryInProgress: 50,
    deliveryFailReasons: { declined: 10, failed: 30 },
    deliveryProgressStatuses: { unassigned: 20, notdone: 30 }
}];

const REFRESH_INTERVAL: number = 30 * 1000;

export default React.memo(function Dashboard() {
    const [level, setLevel] = useState<Level | null>(null);
    const [levelValue, setLevelValue] = useState<string | null>(null);
    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);
    const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null);

    const [fetchFaultsReport] = useApi("/api/faults/status");
    const [fetchDeliveryReports] = useApi("/api/dailyReports");

    const onInitialize = (level: Level, value: string | null) => {
        if (value) setLevelValue(value);
        setLevel(level);
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

    return <div className="dashboard-container">
        {level ? <>
            <DatePanel task={_refreshReports} interval={REFRESH_INTERVAL} />
            <div className="dashboard">
                {deliveryReports && <DeliveryStatus reports={deliveryReports} />}
                {faultsReport && <FaultsStatus report={faultsReport} />}
            </div>
        </> :
            <Initializer onInitialize={onInitialize} />}
    </div>;
});
