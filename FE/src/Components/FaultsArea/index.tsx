import "./index.scss";

import React, { useState, useMemo, useContext, useEffect } from "react";
import classnames from "classnames";

import { useSnackbar } from "notistack";
import { Button } from '@material-ui/core';
import FilterListIcon from "@material-ui/icons/FilterList";
import { ALL_ITEM } from "../../utils/inputs";
import { getBranches } from "../../utils/fetchBranches";
import UserProvider from "../../utils/UserProvider";
import Fault from "./Fault";
import FaultsMenu from "./FaultsMenu";
import getFilters from "./filters";

interface Props {
    faults: Fault[];
    onFaultDelete: (id: string) => void;
    onStatusChange: (faultId: string, status: FaultStatus) => void;
}

export default function FaultsArea(props: Props) {
    const user = useContext(UserProvider);
    const { enqueueSnackbar } = useSnackbar();
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
    const [branches, setBranches] = useState<Branch[]>([]);

    const [district, setDistrict] = useState<string>();
    const [distributionCenter, setDistributionCenter] = useState<string>();
    const [category, setCategory] = useState<string>();
    const [statusFilter, setStatus] = useState<string>();
    const [sortBy, setSortBy] = useState<string>("time");

    useEffect(() => {
        const fetchBranches = async () => {
            const newBranches = await getBranches(user) as Branch[];
            if (!newBranches) return enqueueSnackbar("אירעה שגיאה בקבלת מרכזי חלוקה", { variant: "warning" });
            setBranches(newBranches);
        }
        fetchBranches();
    }, []);

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

    const onFilterChange = (fieldName: string, value: string) => {
        if (fieldName === "category") setCategory(value)
        else if (fieldName === "status") setStatus(value)
        else if (fieldName === "distributionCenter") setDistributionCenter(value)
        else if (fieldName === "district") setDistrict(value);
    }

    const filters = useMemo(() => getFilters(branches), [branches]);

    const faults = useMemo(() => {
        return props.faults.filter(fault =>
            (!category || category === ALL_ITEM.value || fault.category === category) &&
            (!statusFilter || statusFilter === ALL_ITEM.value || fault.status === statusFilter) &&
            (!distributionCenter || distributionCenter === ALL_ITEM.value || fault.distributionCenter === distributionCenter) &&
            (!district || district === ALL_ITEM.value || fault.branch?.district === district)
        ).sort(sortFault);
    }, [props.faults, category, statusFilter, distributionCenter, district, sortBy]);

    return <div className="faults-area">
        <div className="faults-area-header">
            <div className="label">רשימת התקלות</div>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFilterOpen(!isFilterOpen)}>
                <FilterListIcon style={{ marginLeft: 5 }} />
                <span>סינון ומיון</span>
            </Button>
        </div>
        <div className={classnames("faults-filter-container", { open: isFilterOpen })}>
            <FaultsMenu filters={filters} onFilterChange={onFilterChange} onSortChange={setSortBy} />
        </div>
        <div className="faults-list">
            {faults.length === 0 ?
                <div className="empty" >
                    <div className="title">לא נמצאו תקלות</div>
                    <div>או שסיננת את כולן...</div>
                </div> :
                faults.map(fault => <Fault key={fault._id}
                    fault={fault}
                    onStatusChange={props.onStatusChange}
                    onFaultDelete={props.onFaultDelete} />)}
        </div>
    </div>
}
