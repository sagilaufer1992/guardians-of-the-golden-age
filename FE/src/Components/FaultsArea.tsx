import "./FaultsArea.scss";

import React, { useState, useMemo, useContext } from "react";
import Select from "./Select";

import Fault from "./Fault";
import { categoryToText, statusToText } from "../utils/translations";
import UserProvider from "../utils/UserProvider";
import { toSelect, ALL_ITEM } from "../utils/inputs";

const STATUS_FILTER = toSelect(statusToText, true);
const CATEGORY_FILTER = toSelect(categoryToText, true);

const SORT_BY = [
    { value: "time", label: "זמן" },
    { value: "status", label: "סטטוס" },
    { value: "category", label: "סוג משלוח" },
    { value: "distributionCenter", label: "מרכז חלוקה" }
];

interface Props {
    faults: Fault[];
    onStatusChange: (faultId: string, status: FaultStatus) => void;
}

export default function FaultsArea(props: Props) {
    const user = useContext(UserProvider);
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL_ITEM.value);
    const [statusFilter, setStatusFilter] = useState<string>(ALL_ITEM.value);
    const [sortBy, setSortBy] = useState<string>("time");
    const [distributionCenterFilter, setDistributionCenterFilter] = useState<string>(ALL_ITEM.value);

    const distributionCenters = useMemo(() => [ALL_ITEM, ...user.authGroups.map(v => ({ value: v, label: v }))], [user]);

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
            case "distributionCenter":
                return first.distributionCenter.localeCompare(second.distributionCenter);
            default:
                return 0;
        }
    }

    return <div className="faults-area">
        <div className="faults-area-header">
            <div className="label">
                רשימת התקלות
            </div>
            <div className="numbers">
                <div className="number-label">סה״כ</div>
                <div className="total-number">{faults.length}</div>
                <div className="number-label">טרם טופלו</div>
                <div className="active-number">{faults.filter(f => f.status === "Todo").length}</div>
            </div>
        </div>
        <div className="faults-area-sort">
            <Select title="סוג משלוח" options={CATEGORY_FILTER} value={categoryFilter} onChange={setCategoryFilter} />
            <Select title="מרכז חלוקה" options={distributionCenters} value={distributionCenterFilter} onChange={setDistributionCenterFilter} />
            <Select title="סטטוס" options={STATUS_FILTER} value={statusFilter} onChange={setStatusFilter} />
            <Select title="ממוין לפי" options={SORT_BY} value={sortBy} onChange={setSortBy} />
        </div>
        <div className="faults-area-body">
            {faults.length === 0 ?
                <div className="empty-body">לא נמצאו תקלות</div> :
                faults.map(fault => <Fault key={fault._id} fault={fault} onStatusChange={props.onStatusChange} />)}
        </div>
    </div>
}
