import "./DeliveryStatus.scss";
import React from "react";
import { Card, Tooltip, withStyles, Divider, Checkbox } from "@material-ui/core";
import { PieChart, Pie } from "recharts";

import { failRasonToText } from "../../utils/translations";

import logo from "../../assets/logo.png";
import classNames from "classnames";

interface Props {
    hideEmpty: boolean;
    setHideEmpty: (value: boolean) => void;
    level: Level;
    reports: DeliveryReport[];
    onDeliveryReportClick: (value: string) => void;
}

const RADIAN = Math.PI / 180;

const FAILED_COLOR = "#f44336";

export default function DeliveryStatus({ level, reports, hideEmpty, setHideEmpty, onDeliveryReportClick }: Props) {
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

    const _generatePieChart = (color: string, data: any[]) => <PieChart height={250} width={250}>
        <Pie data={data} dataKey="value" nameKey="name" direction="rtl" fill={color} animationDuration={850} labelLine={false} innerRadius={50} label={CustomizedLabel} />
    </PieChart>;

    const _convertToChartData = (data: any, translation: any) =>
        Object.keys(data).map(key => ({ name: translation[key], value: data[key] }))
            .filter(_ => _.value > 0);

    function singleReport(report: DeliveryReport, disabled: boolean) {
        const { name, hasExternalInfo, actual, expected, delivered, deliveryFailed, deliveryInProgress, deliveryFailReasons } = report;
        const max = Math.max(actual, expected); // לפעמים הערך בפועל גדול מזה המצופה

        const deliveryPercent = (delivered / max) * 100;
        const failedPercent = (deliveryFailed / max) * 100;
        const inProgressPercent = Math.min((deliveryInProgress / max) * 100, 100 - failedPercent - deliveryPercent);

        const deliveredStyle = { width: `${deliveryPercent}%`, };
        const failedStyle = { width: `${failedPercent}%` };
        const inProgressStyle = { width: `${inProgressPercent}%` };

        return <div className="report-container" key={name}>
            <div className={classNames("location", { disabled })} onClick={() => onDeliveryReportClick(name)}>
                {hasExternalInfo && <Tooltip classes={{ tooltip: "external-logo-tooltip" }} title='מכיל מידע ממערכת "משמרות הזהב"' placement="top">
                    <img className="external-logo" src={logo} />
                </Tooltip>}
                <span>{name}</span>
            </div>
            <div className="delivery-data">
                <div className="expected-text-info">צפי יומי - {expected} אנשים</div>
                <div className="status-bar">
                    {delivered > 0 && <span className="delivered" style={deliveredStyle} />}
                    {deliveryInProgress > 0 && <span className="in-progress" style={inProgressStyle} />}
                    {deliveryFailed > 0 && <span className="failed" style={failedStyle} />}
                </div>
                <div className="actual-text-info">
                    <span className="delivered">{delivered} חולקו</span>
                    <span className="in-progress zero">{deliveryInProgress} בתהליך חלוקה</span>
                    {deliveryFailed > 0 ? <PieChartTooltip title={_generatePieChart(FAILED_COLOR, _convertToChartData(deliveryFailReasons, failRasonToText))}>
                        <span className="failed">{deliveryFailed} נתקלו בבעיה</span>
                    </PieChartTooltip> : <span className="failed zero">{deliveryFailed} נתקלו בבעיה</span>}
                    <span>{actual} סך הכל</span>
                </div>
            </div>
        </div>
    }

    function getTotalReport() {
        const initialReport: DeliveryReport = {
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
            expected: 0,
            name: "סך הכל",
        };

        return reports.reduce((accumulated, current, index, []) => {
            accumulated.actual += current.actual;
            accumulated.expected += current.expected;
            accumulated.delivered += current.delivered;
            accumulated.deliveryFailed += current.deliveryFailed;
            accumulated.deliveryInProgress += current.deliveryInProgress;

            (Object.keys(current.deliveryFailReasons) as FailReason[]).forEach(
                (reason) => {
                    accumulated.deliveryFailReasons[reason] +=
                        current.deliveryFailReasons[reason];
                }
            );

            return accumulated;
        }, initialReport);
    }

    return (<Card className="panel delivery-status">
        <div className="delivery-status-title">
            <span className="status-title">סטטוס חלוקה לאנשים</span>
            <div className="hide-empty-button">
                <Checkbox color="primary" checked={hideEmpty} onChange={(_, v) => setHideEmpty(v)} />
                <span>הסתר סטטוסים ריקים</span>
            </div>
        </div>
        {reports.length === 0 && <div className="no-reports">
            לא נמצאו דיווחים בזמן וההיררכיה המבוקשים
        </div>}
        {(reports.length > 1) && <>
            <div className="total">
                {singleReport(getTotalReport(), true)}
            </div>
            <Divider variant="fullWidth" />
            <div className="all-reports">{reports.map(report => singleReport(report, level === "municipality"))}</div>
        </>}        
    </Card>);
}