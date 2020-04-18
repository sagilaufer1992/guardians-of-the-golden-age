import "./DeliveryStatus.scss";
import React from "react";
import { Card, Tooltip, withStyles } from "@material-ui/core";
import { PieChart, Pie } from "recharts";

import { failRasonToText, progressStatusToText } from "../../utils/translations";

interface Props {
    reports: DeliveryReport[];
}

const RADIAN = Math.PI / 180;

const IN_PROGRESS_COLOR = "#ff9800";
const FAILED_COLOR = "#f44336";

export default function DeliveryStatus(props: Props) {
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

        return <text x={x} y={y} fill="black" fontSize={14} textAnchor="middle" dominantBaseline="central">{`${name} - ${value}`}</text>;
    }

    const _generatePieChart = (color: string, data: any[]) => <PieChart height={300} width={300}>
        <Pie data={data} dataKey="value" nameKey="name" direction="rtl" fill={color} animationDuration={850} labelLine={false} innerRadius={50} label={CustomizedLabel} />
    </PieChart>;

    const _convertToChartData = (data: any, translation: any) => Object.keys(data).map(key => ({ name: translation[key], value: data[key] }));

    return (<Card className="panel delivery-status">
        {props.reports.length === 0 && <div className="no-reports">
            לא נמצאו דיווחים בזמן וההיררכיה המבוקשים
        </div>}
        {props.reports.map((report, index) => {
            const { name, total, delivered, deliveryFailed, deliveryInProgress, deliveryFailReasons, deliveryProgressStatuses } = report;
            const deliveredStyle = { width: `${(delivered / total) * 100}%` };
            const failedStyle = { width: `${(deliveryFailed / total) * 100}%` };
            const inProgressStyle = { width: `${(deliveryInProgress / total) * 100}%` };

            return <div className="report-container" key={index}>
                <div className="location">{name}</div>
                <div className="delivery-data">
                    <div className="status-bar">
                        {delivered > 0 && <span className="delivered" style={deliveredStyle}>{delivered}</span>}
                        {deliveryInProgress > 0 && <PieChartTooltip title={_generatePieChart(IN_PROGRESS_COLOR, _convertToChartData(deliveryProgressStatuses, progressStatusToText))}>
                            <span className="in-progress" style={inProgressStyle}>{deliveryInProgress}</span>
                        </PieChartTooltip>}
                        {deliveryFailed > 0 && <PieChartTooltip title={_generatePieChart(FAILED_COLOR, _convertToChartData(deliveryFailReasons, failRasonToText))}>
                            <span className="failed" style={failedStyle}>{deliveryFailed}</span>
                        </PieChartTooltip>}
                    </div>
                    <div className="text-info">
                        <span>סה"כ - {total} </span>|
                        <span className="delivered"> חולקו - {delivered} </span>|
                        <span className="in-progress"> בתהליך חלוקה - {deliveryInProgress} </span>|
                        <span className="failed"> נתקלנו בבעיה - {deliveryFailed}</span>

                    </div>
                </div>
            </div>
        })}
    </Card>);
}