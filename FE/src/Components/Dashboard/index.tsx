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

const FAULTS_REPORTS: FaultReport[] = [{
    name: "מחסור בסלי מזון",
    total: 4,
    solved: 2
}, {
    name: "בעיה בספק",
    total: 2,
    solved: 1
}, {
    name: "בעיה עם מתנדבים",
    total: 4,
    solved: 2
}, {
    name: "אחר",
    total: 1,
    solved: 1
}]

interface Props {
}

export default function Dashboard(props: Props) {
    return <div className="dashboard">
        <DeliveryStatus reports={DELIVERY_REPORTS} />
        <FaultsStatus reports={FAULTS_REPORTS} />
    </div>;
}
