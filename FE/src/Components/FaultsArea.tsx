import "./FaultsArea.scss";

import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import Fault from "./Fault";

const faultStatus = [
    { value: "Todo", label: "תקלות שנפתחו" },
    { value: "InProgress", label: "תקלות בתהליך" },
    { value: "Complete", label: "תקלות שנסגרו" },
    { value: "All", label: "הכל" },
];

const faultCategory = [
    { value: "food", label: "מחסור בסלי מזון" },
    { value: "drugs", label: "מחסור בתרופות" },
    { value: "other", label: "אחר" },
    { value: "All", label: "הכל" },
];

const faultSortBy = [
    { value: "time", label: "זמן" },
    { value: "status", label: "סטטוס" },
    { value: "category", label: "סוג משלוח" },
]

interface Props {
    faults: Fault[];
}

export default function FaultsArea(props: Props) {
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>("Time");

    useEffect(() => {
        console.log(statusFilter, categoryFilter, sortBy);
    })

    function onCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCategoryFilter(e.target.value);
    }

    function onStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusFilter(e.target.value);
    }

    function onSortChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSortBy(e.target.value);
    }

    const faults: Fault[] = props.faults
        .filter(fault => (categoryFilter === "All" || fault.category === categoryFilter) &&
            (statusFilter === "All" || fault.status === statusFilter)
        ).sort(sortFault);

    function sortFault(first: Fault, second: Fault): number {
        switch (sortBy) {
            case "time":
                return first.date.getTime() - second.date.getTime();
            case "status":
                return first.status.localeCompare(second.status);
            case "category":
                return first.category.localeCompare(second.category);
            default:
                return 0;
        }
    }

    return <div className="faults-area">
        <div className="faults-area-header">
            <div className="label">
                רשימת הבעיות
            </div>
            <div className="numbers">
                <div className="number-label">סה״כ</div>
                <div className="total-number">{faults.length}</div>
                <div className="number-label">טרם טופלו</div>
                <div className="active-number">{faults.filter(f => f.status === "Todo").length}</div>
            </div>
        </div>
        <div className="faults-area-sort">
            <TextField select className="select" label="סוג משלוח" value={categoryFilter} onChange={onCategoryChange}>
                {faultCategory.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
            <TextField select className="select" label="סטטוס" value={statusFilter} onChange={onStatusChange}>
                {faultStatus.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
            <TextField select className="select" label="ממויין לפי" value={sortBy} onChange={onSortChange}>
                {faultSortBy.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
        </div>
        <div className="faults-area-body">
            {faults.length === 0 && <div className="empty-body">
                לא נמצאו תקלות
            </div>}
            {faults.map(fault => <div key={fault.id}>
                <Fault fault={fault} />
            </div>)}
        </div>
    </div>
}