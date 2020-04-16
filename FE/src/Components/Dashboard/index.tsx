import "./index.scss";

import React, { useState } from "react";

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

interface Props {
}

export default React.memo(function Dashboard(props: Props) {
  const [date, setDate] = useState<Date>();
  const [level, setLevel] = useState<string>("");
  const [value, setValue] = useState<string>("");

  return (
    <div className="dashboard">
      {date && level ? (
        <>
        <DeliveryStatus reports={DELIVERY_REPORTS} />
        <FaultsStatus report={FAULTS_REPORTS} />
        </>
      ) : (
        <Initializer
          onInitialize={(date, level, value) => {
            setDate(date);
            setLevel(level);
            if (value) setValue(value);
          }}
        />
      )}
      }
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
