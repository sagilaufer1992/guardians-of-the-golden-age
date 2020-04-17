import "./index.scss";

import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";

import Initializer from "./Initializer";
import DeliveryStatus from "./DeliveryStatus";
import FaultsStatus from "./FaultsStatus";

const DELIVERY_REPORTS: DeliveryReport[] = [
    {
        total: 400,
        delivered: 234,
        deliveryFailed: 50,
        name: "מקום חשוב",
        deliveryFailReasons: {
            "תקלה חמורה": 10,
            "פאשלה": 30,
            "אופסי": 10
        },
        pendingDelivery: 116
    },
    {
        total: 400,
        delivered: 234,
        deliveryFailed: 50,
        name: "מקום חשוב",
        deliveryFailReasons: {
            "תקלה חמורה": 10,
            "פאשלה": 30,
            "אופסי": 10
        },
        pendingDelivery: 116
    },
    {
        total: 400,
        delivered: 234,
        deliveryFailed: 50,
        name: "מקום חשוב",
        deliveryFailReasons: {
            "תקלה חמורה": 10,
            "פאשלה": 30,
            "אופסי": 10
        },
        pendingDelivery: 116
    },
    {
        total: 400,
        delivered: 234,
        deliveryFailed: 50,
        name: "מקום חשוב",
        deliveryFailReasons: {
            "תקלה חמורה": 10,
            "פאשלה": 30,
            "אופסי": 10
        },
        pendingDelivery: 116
    }
]

const FAULTS_REPORTS: FaultsReport = {
    "total": 18,
    "open": 8,
    "reasons": [
        {
            "open": 4,
            "closed": 4,
            "category": "food"
        },
        {
            "open": 3,
            "closed": 3,
            "category": "drugs"
        },
        {
            "open": 1,
            "closed": 3,
            "category": "other"
        },
    ]
}

export default React.memo(function Dashboard() {
    const date = new Date();

    const [level, setLevel] = useState<Level | null>(null);
    const [levelValue, setLevelValue] = useState<string | null>(null);
    const [faultsReport, setFaultsReport] = useState<FaultsReport | null>(null);

    const query = `level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date}`;
    const [fetchFaultsReport] = useApi(`/api/faults/status?${query}`);

    const onInitialize = async (level: Level, value: string | null) => {
        setLevel(level);
        if (value) setLevelValue(value);

        const faultsReport = await fetchFaultsReport<FaultsReport>();

        if (faultsReport) setFaultsReport(faultsReport);
    }

    return (
        <div className="dashboard">
            {level ? <>
                <DeliveryStatus reports={DELIVERY_REPORTS} />
                {faultsReport && <FaultsStatus report={faultsReport} />}
            </> :
                <Initializer onInitialize={onInitialize} />}
        </div>
    );
});

function _createQueryString(date: Date, level: string, value?: string): string {
    const basicQueryString = `level=${level}&date=${date
        .toISOString()
        .split("T")
        .join(" ")}`;
    return value ? basicQueryString + `&value=${value}` : basicQueryString;
}
