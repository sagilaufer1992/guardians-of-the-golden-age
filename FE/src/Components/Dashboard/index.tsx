import "./index.scss";

import React from 'react';

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

interface Props {
}

export default function Dashboard(props: Props) {
    return <div className="dashboard">
        <DeliveryStatus reports={DELIVERY_REPORTS} />
        <FaultsStatus report={FAULTS_REPORTS} />
    </div>;
}
