import "./index.scss";

import React, { useState, useMemo, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Hidden, TextField, Button } from '@material-ui/core';
import FilterListIcon from "@material-ui/icons/FilterList";
import { categoryToText, statusToText } from "../../utils/translations";
import UserProvider from "../../utils/UserProvider";
import { toSelect, ALL_ITEM } from "../../utils/inputs";
import { getBranches } from "../../utils/fetchBranches";
import { isHamal } from "../../utils/roles";

import Fault from "./Fault";
import Select from "../Inputs/Select";

const STATUS_FILTER = toSelect(statusToText, true);
const CATEGORY_FILTER = toSelect(categoryToText, true);

const SORT_BY = [
    { value: "time", label: "זמן" },
    { value: "status", label: "סטטוס" },
    { value: "category", label: "קטגוריה" },
    { value: "distributionCenter", label: "מרכז חלוקה" }
];

interface Props {
    faults: Fault[];
    onFaultDelete: (id: string) => void;
    onStatusChange: (faultId: string, status: FaultStatus) => void;
}

export default function FaultsArea(props: Props) {
    const user = useContext(UserProvider);
    const { enqueueSnackbar } = useSnackbar();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL_ITEM.value);
    const [statusFilter, setStatusFilter] = useState<string>(ALL_ITEM.value);
    const [districtFilter, setDistrictFilter] = useState<string>(ALL_ITEM.value);
    const [sortBy, setSortBy] = useState<string>("time");
    const [distributionCenterFilter, setDistributionCenterFilter] = useState<string>(ALL_ITEM.value);

    const distributionCenters = useMemo(() => [ALL_ITEM, ...branches.map(b => ({ value: b.name, label: b.name }))], [branches]);
    const districts = useMemo(() => {
        const district = Array.from(new Set(branches.map(b => b.district)));
        return [ALL_ITEM, ...district.map(b => ({ value: b, label: b }))];
    }, [branches]);

    const faults: Fault[] = props.faults
        .filter(fault => (categoryFilter === ALL_ITEM.value || fault.category === categoryFilter) &&
            (statusFilter === ALL_ITEM.value || fault.status === statusFilter) &&
            (distributionCenterFilter === ALL_ITEM.value || fault.distributionCenter === distributionCenterFilter) &&
            (districtFilter === ALL_ITEM.value || fault.branch?.district === districtFilter)
        ).sort(sortFault);

    useEffect(() => { fetchBranches() }, []);

    async function fetchBranches() {
        const newBranches = await getBranches(user) as Branch[];
        if (!newBranches) return enqueueSnackbar("אירעה שגיאה בקבלת מרכזי חלוקה", { variant: "warning" });

        setBranches(newBranches);
    }

    function sortFault(first: Fault, second: Fault): number {
        switch (sortBy) {
            case "time":
                return second.date.getTime() - first.date.getTime();
            case "status":
                return second.status.localeCompare(first.status);
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
            <Hidden smUp>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => { }}                >
                    <FilterListIcon style={{ marginLeft: 5 }} />
                        סינון ומיון
                </Button>
            </Hidden>
            {isHamal(user) && <div className="numbers">
                <div>{`סה״כ ${faults.length}`}</div>
                <div>{`טרם טופלו ${faults.filter(f => f.status === "Todo").length}`}</div>
            </div>}
        </div>
        <Hidden smDown>
            <div className="faults-area-sort">
                <Select title="מחוז" options={districts} value={districtFilter} onChange={setDistrictFilter} />
                <Autocomplete disableClearable
                    defaultValue={ALL_ITEM}
                    onChange={(e: any, value: any) => { setDistributionCenterFilter(value?.value) }}
                    getOptionLabel={(option) => option.label}
                    options={distributionCenters}
                    renderInput={(params: any) => (<TextField className="distribution-autocomplete" {...params} label="מרכז חלוקה" variant="outlined" />)} />
                <Select title="קטגוריה" options={CATEGORY_FILTER} value={categoryFilter} onChange={setCategoryFilter} />
                <Select title="סטטוס" options={STATUS_FILTER} value={statusFilter} onChange={setStatusFilter} />
                <Select title="ממוין לפי" options={SORT_BY} value={sortBy} onChange={setSortBy} />
            </div>
        </Hidden>
        <div className="faults-area-body">
            {faults.length === 0 ?
                <div className="empty-body">לא נמצאו תקלות</div> :
                faults.map(fault => <Fault key={fault._id}
                    fault={fault}
                    onStatusChange={props.onStatusChange}
                    onFaultDelete={props.onFaultDelete} />)}
        </div>
    </div>
}
