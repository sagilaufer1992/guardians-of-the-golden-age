import "./index.scss";

import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";

import { useApi } from "../../hooks/useApi";
import { AppRouteProps } from "../../routesConfig";
import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";
import DatePanel from "../DatePanel";
import { useUser } from "../../utils/UserProvider";

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
    const { role } = useUser();
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

    const onInitialize = (level: Level, value: string | null) => {
        if (value) {
            setLevelValue(value);
            window.localStorage.setItem(LEVEL_VALUE_KEY, value);
        }

        setLevel(level);
        window.localStorage.setItem(LEVEL_KEY, level);
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

    return <Container className="dashboard-container" maxWidth="xl">
        {level ? <>
            <DatePanel date={date}
                setDate={setDate}
                task={_refreshReports}
                interval={REFRESH_INTERVAL}
                loadExpectedReports={["admin", "hamal"].includes(role) && !!deliveryReports && deliveryReports.length === 0} />
            <div className="dashboard">
                {deliveryReports && <DeliveryStatus reports={deliveryReports} />}
                {faultsReport && <FaultsStatus report={faultsReport} />}
            </div>
        </> :
            <Initializer onInitialize={onInitialize} />}
    </Container>;
});
