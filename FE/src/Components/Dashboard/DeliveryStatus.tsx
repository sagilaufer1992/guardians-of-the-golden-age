import "./DeliveryStatus.scss";
import React, { useMemo, useEffect, useState } from "react";
import classNames from "classnames";
import { PieChart, Pie } from "recharts";
import { Card, Tooltip, withStyles, Divider, Checkbox, Button, Hidden } from "@material-ui/core";

import logo from "../../assets/logo.png";
import { isToday } from "../../utils/dates";
import { failRasonToText, deliveryTypeToText } from "../../utils/translations";

import DeliveryReport from "../DeliveryReport/DeliveryReportDialog";
import { DoneAll, Assessment, LocalShipping, Warning } from "@material-ui/icons";

interface Props {
    date: Date;
    hideEmpty: boolean;
    level: Level;
    levelValue: string | null;
    reports: DeliveryReport[];
    setHideEmpty: (value: boolean) => void;
    onDeliveryReportClick: (value: string) => void;
    onDeliveryUpdated: () => void;
}

const RADIAN = Math.PI / 180;

const FAILED_COLOR = "#f44336";

interface DeliveryTypeButton {
    name: string;
    isActive: boolean;
}

export default function DeliveryStatus({ level, levelValue, reports, hideEmpty, setHideEmpty, onDeliveryReportClick, date, onDeliveryUpdated }: Props) {
    const allDeliveryTypes = useMemo(() => Array.from(new Set<string>(reports.flatMap(_ => Object.keys(_.deliveries)))), [reports]);
    const [shownDeliveryTypes, setShownDeliveryTypes] = useState<DeliveryTypeButton[]>(allDeliveryTypes.map(name => ({ name, isActive: true })));

    useEffect(() => {
        const currentTypes = shownDeliveryTypes.map(_ => _.name);
        const newDeliveryTypes = allDeliveryTypes.filter(t => !currentTypes.includes(t)).map((name => ({ name, isActive: true })));

        setShownDeliveryTypes([...shownDeliveryTypes.filter(_ => allDeliveryTypes.includes(_.name)), ...newDeliveryTypes]);
    }, [allDeliveryTypes]);

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

    function singleReport(report: DeliveryReport, disabled: boolean, isTotal: boolean = false) {
        const { name, hasExternalInfo, deliveries, address } = report;

        const filteredDeliveries = Object.entries(deliveries).filter(([key]) => shownDeliveryTypes.some(_ => _.name === key && _.isActive));

        if (filteredDeliveries.length === 0) return null;

        return <div className="report-container" key={`${levelValue}|${name}|${address}`}>
            <div className={classNames("location", { disabled })} onClick={() => onDeliveryReportClick(name)}>
                {level === "municipality" && !isTotal && isToday(date) &&
                    <DeliveryReport name={name} municipality={levelValue!} disabled={!!hasExternalInfo} onUpdate={onDeliveryUpdated} />}
                {hasExternalInfo && <Tooltip title='מכיל מידע ממערכת "משמרות הזהב"' placement="top">
                    <img className="external-logo" src={logo} />
                </Tooltip>}
                <span>{name}</span>
                {address && <Tooltip title={address} placement="bottom">
                    <span className="report-address">{address}</span>
                </Tooltip>}
            </div>
            <div className="deliveries-data">
                {filteredDeliveries.map(([deliveryType, deliveryInfo]) => {
                    const { expected, delivered, deliveryInProgress, deliveryFailed, deliveryFailReasons, actual } = deliveryInfo;
                    const max = Math.max(actual, expected); // לפעמים הערך בפועל גדול מזה המצופה

                    const deliveryPercent = (delivered / max) * 100;
                    const failedPercent = (deliveryFailed / max) * 100;
                    const inProgressPercent = Math.min((deliveryInProgress / max) * 100, 100 - failedPercent - deliveryPercent);

                    const deliveredStyle = { width: `${deliveryPercent}%`, };
                    const failedStyle = { width: `${failedPercent}%` };
                    const inProgressStyle = { width: `${inProgressPercent}%` };

                    return <div className="delivery" key={deliveryType}>
                        <div className="delivery-info">
                            <div className="expected-text-info"><span>{deliveryTypeToText[deliveryType] ?? deliveryType}</span> | צפי יומי - {expected} אנשים</div>
                            <div className="actual-text-info">
                                <span className="delivered">{delivered}<DoneAll fontSize="small" /></span>
                                <span className="in-progress">{deliveryInProgress}<LocalShipping fontSize="small" /></span>
                                {deliveryFailed > 0 ? <PieChartTooltip title={_generatePieChart(FAILED_COLOR, _convertToChartData(deliveryFailReasons, failRasonToText))}>
                                    <span className="failed">{deliveryFailed}<Warning fontSize="small" /></span>
                                </PieChartTooltip> : <span className="failed zero">{deliveryFailed}<Warning fontSize="small" /></span>}
                                <span>{actual}<Assessment fontSize="small" /></span>
                            </div>
                        </div>
                        <div className="status-bar">
                            {delivered > 0 && <span className="delivered" style={deliveredStyle} />}
                            {deliveryInProgress > 0 && <span className="in-progress" style={inProgressStyle} />}
                            {deliveryFailed > 0 && <span className="failed" style={failedStyle} />}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    }

    function getTotalReport() {
        const totalReport: DeliveryReport = {
            name: "סך הכל",
            deliveries: shownDeliveryTypes.filter(_ => _.isActive).reduce((pv, { name }) => ({
                ...pv,
                [name]: {
                    expected: 0,
                    actual: 0,
                    delivered: 0,
                    deliveryFailed: 0,
                    deliveryInProgress: 0,
                    deliveryFailReasons: { address: 0, declined: 0, other: 0, unreachable: 0 },
                }
            }), {})
        };

        for (const report of reports) {
            for (const [deliveryType, deliveryReport] of Object.entries(report.deliveries)) {
                const { deliveries } = totalReport;
                if (!deliveries[deliveryType]) continue;

                deliveries[deliveryType].actual += deliveryReport.actual;
                deliveries[deliveryType].expected += deliveryReport.expected;
                deliveries[deliveryType].delivered += deliveryReport.delivered;
                deliveries[deliveryType].deliveryFailed += deliveryReport.deliveryFailed;
                deliveries[deliveryType].deliveryInProgress += deliveryReport.deliveryInProgress;

                for (const [failReason, failReasonCount] of Object.entries(deliveryReport.deliveryFailReasons)) {
                    deliveries[deliveryType].deliveryFailReasons[failReason as FailReason] += failReasonCount;
                }
            }
        }

        return totalReport;
    }

    const reportsMemo = useMemo(() => reports.map(report => singleReport(report, level === "municipality")).filter(Boolean), [reports, shownDeliveryTypes]);
    const totalReportMemo = useMemo(() => reportsMemo.length > 0 ? singleReport(getTotalReport(), true, true) : null, [reports, shownDeliveryTypes]);

    function onShownDeliveryTypeClick(name: string, newValue: boolean) {
        const index = shownDeliveryTypes.findIndex(_ => _.name === name);
        const newShownDeliveryTypes = [...shownDeliveryTypes];
        newShownDeliveryTypes[index] = { name, isActive: newValue };

        setShownDeliveryTypes(newShownDeliveryTypes);
    }

    return (<Card className="panel delivery-status">
        <div className="delivery-status-title">
            <span className="status-title">סטטוס חלוקה לאנשים</span>
            {shownDeliveryTypes.length > 0 && <div className="delivery-filter-buttons">
                <span className="filter-buttons-title">הצג:</span>
                {shownDeliveryTypes.map(({ name, isActive }) => <Button key={name}
                    variant="contained"
                    className="filter-button"
                    color={isActive ? "primary" : "default"}
                    onClick={() => onShownDeliveryTypeClick(name, !isActive)}>
                    {deliveryTypeToText[name] ?? name}
                </Button>)}
            </div>}
            <div className="hide-empty-button">
                <Checkbox color="primary" checked={hideEmpty} onChange={(_, v) => setHideEmpty(v)} />
                <span>הסתר סטטוסים ריקים</span>
            </div>
        </div>
        {reportsMemo.length === 0 && <div className="no-reports">
            לא נמצאו דיווחים בזמן וההיררכיה המבוקשים
        </div>}
        {reportsMemo.length > 0 && <>
            <div className="delivery-status-header">
                <div className="total">{totalReportMemo}</div>
                <Hidden smDown>
                    <Card className="delivery-status-legend">
                        <span className="delivered"><DoneAll fontSize="small" />בוצע</span>
                        <span className="in-progress"><LocalShipping fontSize="small" />בתהליך</span>
                        <span className="failed zero"><Warning fontSize="small" />נתקלו בבעיה</span>
                        <span><Assessment fontSize="small" />סך הכל</span>
                    </Card>
                </Hidden>
            </div>
            <Divider variant="fullWidth" />
            <div className="all-reports">
                {reportsMemo}
                {reportsMemo.length % 2 !== 0 && <div className="empty-report-container" />}
            </div>
        </>}
    </Card>);
}