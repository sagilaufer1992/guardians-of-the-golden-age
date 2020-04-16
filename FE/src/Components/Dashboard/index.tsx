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
        <FaultsStatus />
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
