import "./FaultsList.scss";

import React, { useState, useMemo, useContext, useEffect } from "react";
import classnames from "classnames";

import { useSnackbar } from "notistack";
import { Button, Container } from '@material-ui/core';
import FilterListIcon from "@material-ui/icons/FilterList";
import { ALL_ITEM } from "../../utils/inputs";
import { getBranches } from "../../utils/fetchBranches";
import { useUser } from "../../utils/UserProvider";
import Fault from "./Fault";
import FaultsMenu from "./FaultsMenu";
import getFilterDefinitions from "./filters";

interface Props {
    faults: Fault[];
    onFaultDelete?: (id: string) => void;
    onStatusChange?: (faultId: string, status: FaultStatus) => void;
}

const FaultsList = (props: Props) => {
    const user = useUser();
    const { enqueueSnackbar } = useSnackbar();

    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
    const [filterDefinitions, setFilterDefinitions] = useState<Record<string, FilterDefinition>>();

    const [sortBy, setSortBy] = useState<string>("time");
    const [filters, setFilters] = useState({
        district: null,
        distributionCenter: null,
        category: null,
        status: null
    });

    useEffect(() => {
        const initFilterDefinitions = async () => {
            const branches = await getBranches(user);

            if (!branches) enqueueSnackbar("אירעה שגיאה בקבלת מרכזי חלוקה", { variant: "warning" });

            setFilterDefinitions(getFilterDefinitions(branches || []));
        }

        initFilterDefinitions();
    }, []);

    const faults = useMemo(() => {
        const { category, status, distributionCenter, district } = filters;

        return props.faults.filter(fault =>
            (!category || category === ALL_ITEM.value || fault.category === category) &&
            (!status || status === ALL_ITEM.value || fault.status === status) &&
            (!distributionCenter || distributionCenter === ALL_ITEM.value || fault.distributionCenter === distributionCenter) &&
            (!district || district === ALL_ITEM.value || fault.branch?.district === district)
        ).sort(sortFault);
    }, [props.faults, filters, sortBy]);

    function sortFault(first: Fault, second: Fault) {
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

    const onFilterChange = (fieldName: string, value: string) => setFilters({ ...filters, [fieldName]: value });

    return <div className="faults-area">
        <div className="faults-area-header">
            <div className="title">רשימת התקלות</div>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFilterOpen(!isFilterOpen)}>
                <FilterListIcon style={{ marginLeft: 5 }} />
                <span>סינון ומיון</span>
            </Button>
        </div>
        <div className={classnames("faults-filter-container", { open: isFilterOpen })}>
            {filterDefinitions && <FaultsMenu
                filters={filterDefinitions}
                onFilterChange={onFilterChange}
                onSortChange={setSortBy} />}
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

export default React.memo(FaultsList);