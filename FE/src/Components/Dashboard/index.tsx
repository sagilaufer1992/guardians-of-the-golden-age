import "./index.scss";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Container, Hidden } from "@material-ui/core";

import { useApi } from "../../hooks/useApi";
import { AppRouteProps } from "../../routesConfig";
import { dayDifference } from "../../utils/dates";

import DeliveryStatus from "./DeliveryStatus";
import DatePanel from "../DatePanel";
import UploadDeliveryFile from "./UploadDeliveryFile";

const TEST_DELIVERY_REPORTS: DeliveryReport[] = [{
    name: "רחובות",
    deliveries: {
        food: {
            expected: 400,
            actual: 400,
            delivered: 234,
            deliveryFailed: 40,
            deliveryInProgress: 50,
            deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
        }
    }
}, {
    name: "רחובות",
    deliveries: {
        food: {
            expected: 400,
            actual: 400,
            delivered: 234,
            deliveryFailed: 40,
            deliveryInProgress: 50,
            deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
        }
    }
},
{
    name: "רחובות",
    deliveries: {
        food: {
            expected: 400,
            actual: 400,
            delivered: 234,
            deliveryFailed: 40,
            deliveryInProgress: 50,
            deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
        }
    }
},
{
    name: "רחובות",
    deliveries: {
        food: {
            expected: 400,
            actual: 400,
            delivered: 234,
            deliveryFailed: 40,
            deliveryInProgress: 50,
            deliveryFailReasons: { declined: 10, unreachable: 15, address: 10, other: 5 }
        }
    }
}];

const REFRESH_INTERVAL: number = 30 * 1000;

const HIERARCHY_LEVELS_ORDER: Level[] = ["national", "district", "napa", "municipality"]

export default function Dashboard({ date, setDate, levelAndValue, setLevelAndValue }: AppRouteProps) {
    const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null);
    const [hideEmpty, setHideEmpty] = useState<boolean>(false);
    const datePanelRef = useRef<DatePanel>(null);

    const [fetchDeliveryReports] = useApi("/api/dailyReports");

    const showUpload = useMemo(() => dayDifference(date, new Date()) >= 0, [date]);

    const onUpdate = useCallback(() => { datePanelRef.current?.refresh() }, [datePanelRef]);
    
    useEffect(onUpdate, [levelAndValue, hideEmpty]);

    const _refreshReports = useCallback(async (date: Date) => {
        const { level, value: levelValue } = levelAndValue;
        const params = `?level=${level}${levelValue ? `&value=${levelValue}` : ""}&date=${date.toISOString()}&hideEmpty=${hideEmpty}`;
        const newDeliveryReports = await fetchDeliveryReports<DeliveryReport[]>({ route: params });

        if (!newDeliveryReports) throw new Error();

        newDeliveryReports && setDeliveryReports(newDeliveryReports);
    }, [date, levelAndValue, hideEmpty]);

    const onExpectedFileUploaded = () => {
        setHideEmpty(false);
        onUpdate();
    };

    const onDeliveryReportClick = (value: string) => {
        const levelIndex = HIERARCHY_LEVELS_ORDER.findIndex(level => level === levelAndValue.level);

        if (levelIndex === -1 || levelIndex >= HIERARCHY_LEVELS_ORDER.length - 1 || levelAndValue.value === value) return;

        setLevelAndValue(HIERARCHY_LEVELS_ORDER[levelIndex + 1], value);
    }

    return <Container className="dashboard-container" maxWidth="xl">
        <DatePanel ref={datePanelRef}
            date={date}
            setDate={setDate}
            task={_refreshReports}
            interval={REFRESH_INTERVAL} />
        {deliveryReports && showUpload && <Hidden smDown>
            <UploadDeliveryFile title="העלה נתוני חלוקה עבור יום זה" date={date} onUploaded={onExpectedFileUploaded} />
        </Hidden>}
        <div className="dashboard">
            {deliveryReports && <DeliveryStatus
                date={date}
                hideEmpty={hideEmpty}
                setHideEmpty={setHideEmpty}
                level={levelAndValue.level}
                levelValue={levelAndValue.value}
                reports={deliveryReports}
                onDeliveryUpdated={onUpdate}
                onDeliveryReportClick={onDeliveryReportClick} />}
        </div>
    </Container>;
};
