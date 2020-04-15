import "./index.scss";
import React from "react";
import { Container, Tooltip, withStyles } from "@material-ui/core";
import { PieChart, Pie, PieProps } from "recharts";

interface Props {
    reports: DeliveryReport[];
}

export default function DeliveryStatus(props: Props) {
    const PieChartTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: "white",
            border: "1px solid #ff4848"
        },
    }))(Tooltip);

    const RADIAN = Math.PI / 180;
    const CustomizedLabel = (props: any) => {
        const { name, value, cx, cy, midAngle, innerRadius, outerRadius } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return <text x={x} y={y} fill="black" fontSize={14} textAnchor="middle" dominantBaseline="central">{`${name} - ${value}`}</text>;
    }

    const _generatePieChart = (data: any[]) => <PieChart height={300} width={300}>
        <Pie data={data} dataKey="value" nameKey="name" direction="rtl" fill="#ff4848" animationDuration={850} labelLine={false} innerRadius={50} label={CustomizedLabel} />
    </PieChart>;

    const _convertToChartData = (data: any) => Object.keys(data).map(key => ({ name: key, value: data[key] }));

    return (<Container className="delivery-status">
        {props.reports.map((report, index) => {
            const { name, total, delivered, deliveryFailed, deliveryFailReasons } = report;
            const deliveredStyle = { width: `${(delivered / total) * 100}%` };
            const failedStyle = { width: `${(deliveryFailed / total) * 100}%` };

            console.log(_convertToChartData(deliveryFailReasons));

            return <div className="report-container" key={index}>
                <div className="location">{name}</div>
                <div className="delivery-data">
                    <div className="status-bar">
                        <span className="delivered" style={deliveredStyle}>{delivered}</span>
                        <PieChartTooltip title={_generatePieChart(_convertToChartData(deliveryFailReasons))}>
                            <span className="failed" style={failedStyle}>{deliveryFailed}</span>
                        </PieChartTooltip>
                    </div>
                    <div className="text-info">
                        <span className="delivered">חולקו {`${delivered}/${total}`}</span>
                        <span className="failed">נתקלנו בבעיה {`${deliveryFailed}/${total}`}</span>
                    </div>
                </div>
            </div>
        })}
    </Container>);
}