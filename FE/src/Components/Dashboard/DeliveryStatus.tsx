import "./DeliveryStatus.scss";
import React, { useMemo } from "react";
import classNames from "classnames";
import { PieChart, Pie } from "recharts";
import { Card, Tooltip, withStyles, Divider, Checkbox } from "@material-ui/core";

import logo from "../../assets/logo.png";
import { isToday } from "../../utils/dates";
import { failRasonToText } from "../../utils/translations";

import DeliveryReport from "../DeliveryReport/DeliveryReportDialog";

interface Props {
    date: Date;
    hideEmpty: boolean;
    level: Level;
    levelValue: string | null;
    reports: DeliveryReport[];
    setHideEmpty: (value: boolean) => void;
    onDeliveryReportClick: (value: string) => void;
}

const RADIAN = Math.PI / 180;

const FAILED_COLOR = "#f44336";

export default function DeliveryStatus({ level, levelValue, reports, hideEmpty, setHideEmpty, onDeliveryReportClick, date }: Props) {
    const PieChartTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: "white",
            border: "1px solid #ff4848"
        },
    }))(Tooltip);

    const CustomizedLabel = (props: any) => {
        const { name, value, cx, cy, midAngle, innerRadius, outerRadius } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return <text x={x} y={y} fill="black" fontSize={11} textAnchor="middle" dominantBaseline="central">{`${name} - ${value}`}</text>;
    }

    const translateDeliveryType = (type: DeliveryType): string => {
        switch (type) {
            case "food_hot":
                return "מנות חמות";
            case "food_cold":
                return "סלי מזון";
            case "mask":
                return "מסיכות";
            case "flower":
                return "פרחים";
            default:
                return type;
        }
    }

    const _generatePieChart = (color: string, data: any[]) => <PieChart height={250} width={250}>
        <Pie data={data} dataKey="value" nameKey="name" direction="rtl" fill={color} animationDuration={850} labelLine={false} innerRadius={50} label={CustomizedLabel} />
    </PieChart>;

    const _convertToChartData = (data: any, translation: any) =>
        Object.keys(data).map(key => ({ name: translation[key], value: data[key] }))
            .filter(_ => _.value > 0);

    function singleReport(report: DeliveryReport, disabled: boolean, isTotal: boolean = false) {
        const { name, hasExternalInfo, deliveries } = report;

        return <div className="report-container" key={name}>
            <div className={classNames("location", { disabled })} onClick={() => onDeliveryReportClick(name)}>
                {hasExternalInfo && <Tooltip title='מכיל מידע ממערכת "משמרות הזהב"' placement="top">
                    <img className="external-logo" src={logo} />
                </Tooltip>}
                <span>{name}</span>
            </div>
            <div className="deliveries-data">
                {Object.entries(deliveries).map(([deliveryType, deliveryInfo]) => {
                    const { expected, delivered, deliveryInProgress, deliveryFailed, deliveryFailReasons, actual } = deliveryInfo;
                    const max = Math.max(actual, expected); // לפעמים הערך בפועל גדול מזה המצופה

                    const deliveryPercent = (delivered / max) * 100;
                    const failedPercent = (deliveryFailed / max) * 100;
                    const inProgressPercent = Math.min((deliveryInProgress / max) * 100, 100 - failedPercent - deliveryPercent);

                    const deliveredStyle = { width: `${deliveryPercent}%`, };
                    const failedStyle = { width: `${failedPercent}%` };
                    const inProgressStyle = { width: `${inProgressPercent}%` };

                    return <div className="delivery">
                        <div className="expected-text-info"><span style={{ fontWeight: "bold" }}>חלוקת {translateDeliveryType(deliveryType)}</span> | צפי יומי - {expected} אנשים</div>
                        <div className="status-bar">
                            {delivered > 0 && <span className="delivered" style={deliveredStyle} />}
                            {deliveryInProgress > 0 && <span className="in-progress" style={inProgressStyle} />}
                            {deliveryFailed > 0 && <span className="failed" style={failedStyle} />}
                        </div>
                        <div className="actual-text-info">
                            <span className="delivered">בוצע: {delivered}</span>
                            <span className="in-progress zero">בדרך: {deliveryInProgress}</span>
                            {deliveryFailed > 0 ? <PieChartTooltip title={_generatePieChart(FAILED_COLOR, _convertToChartData(deliveryFailReasons, failRasonToText))}>
                                <span className="failed"> נתקלו בבעיה: {deliveryFailed}</span>
                            </PieChartTooltip> : <span className="failed zero">נתקלו בבעיה: {deliveryFailed}</span>}
                            <span>סך הכל: {actual}</span>
                        </div>                        
                    </div>;
                })}
            </div>
            {level === "municipality" && !isTotal && isToday(date) &&
                <DeliveryReport name={name} municipality={levelValue!} disabled={!!hasExternalInfo} />}
        </div>
    }

    function getTotalReport() {
        const initialReport: DeliveryReport = {
            deliveries: {},
            name: "סך הכל"
        };

        const reportInfoTemplate = {
            actual: 0,
            delivered: 0,
            deliveryFailReasons: {
                address: 0,
                declined: 0,
                other: 0,
                unreachable: 0,
            },
            deliveryFailed: 0,
            deliveryInProgress: 0,
            expected: 0
        };

        return reports.reduce((accumulated, current, index, []) => {
            Object.entries(current.deliveries).map(([deliveryType, deliveryInfo]) => {
                if (!accumulated.deliveries[deliveryType]) accumulated.deliveries[deliveryType] = { ...reportInfoTemplate };

                const currentAccumulated = accumulated.deliveries[deliveryType];

                currentAccumulated.actual += deliveryInfo.actual;
                currentAccumulated.expected += deliveryInfo.expected;
                currentAccumulated.delivered += deliveryInfo.delivered;
                currentAccumulated.deliveryFailed += deliveryInfo.deliveryFailed;
                currentAccumulated.deliveryInProgress += deliveryInfo.deliveryInProgress;

                (Object.keys(deliveryInfo.deliveryFailReasons) as FailReason[]).forEach(
                    (reason) => {
                        currentAccumulated.deliveryFailReasons[reason] +=
                            deliveryInfo.deliveryFailReasons[reason];
                    }
                );
            });

            return accumulated;
        }, initialReport);
    }

    const reportsMemo = useMemo(() => reports.map(report => singleReport(report, level === "municipality")), [reports]);

    return (<Card className="panel delivery-status">
        <div className="delivery-status-title">
            <span className="status-title">סטטוס חלוקה לאנשים</span>
            <div className="hide-empty-button">
                <Checkbox color="primary" checked={hideEmpty} onChange={(_, v) => setHideEmpty(v)} />
                <span>הסתר סטטוסים ריקים</span>
            </div>
        </div>
        {reportsMemo.length === 0 && <div className="no-reports">
            לא נמצאו דיווחים בזמן וההיררכיה המבוקשים
        </div>}
        {reportsMemo.length > 0 && <>
            <div className="total">
                {singleReport(getTotalReport(), true, true)}
            </div>
            <Divider variant="fullWidth" />
            <div className="all-reports">{reportsMemo}</div>
        </>}
    </Card>);
}