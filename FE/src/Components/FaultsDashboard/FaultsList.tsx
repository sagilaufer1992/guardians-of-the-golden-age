import "./FaultsList.scss";

import React, { useState, useMemo, useEffect } from "react";
import classnames from "classnames";

import { Button, Container } from '@material-ui/core';
import FilterListIcon from "@material-ui/icons/FilterList";
import { ALL_ITEM, toSelect } from "../../utils/inputs";
import { statusToText, categoryToText } from "../../utils/translations";
import Fault from "./Fault";
import FaultsMenu from "./FaultsMenu";

interface Props {
    faults: Fault[];
    onFaultDelete?: (id: string) => void;
    onStatusChange?: (faultId: string, status: FaultStatus) => void;
}

const FILTER_DEFINITIONS: Record<string, FilterDefinition> = {
    status: {
        type: "DropDown",
        title: "סטטוס",
        defaultValue: ALL_ITEM.value,
        options: [ALL_ITEM, ...toSelect(statusToText)]
    },
    category: {
        type: "DropDown",
        title: "קטגוריה",
        defaultValue: ALL_ITEM.value,
        options: [ALL_ITEM, ...toSelect(categoryToText)]
    }
}

const FaultsList = (props: Props) => {
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);

    const [sortBy, setSortBy] = useState<string>("time");
    const [filters, setFilters] = useState({
        category: null,
        status: null
    });

    const faults = useMemo(() => {
        const { category, status } = filters;

        return props.faults.filter(fault =>
            (!category || category === ALL_ITEM.value || fault.category === category) &&
            (!status || status === ALL_ITEM.value || fault.status === status)
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
            case "branchName":
                return first.branch.name.localeCompare(second.branch.name);
            default:
                return 0;
        }
    }

    const onFilterChange = (fieldName: string, value: string) => setFilters({ ...filters, [fieldName]: value });

    return <Container className="faults-area panel" maxWidth="md">
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
            <FaultsMenu
                filters={FILTER_DEFINITIONS}
                onFilterChange={onFilterChange}
                onSortChange={setSortBy} />
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
    </Container>;
}

export default React.memo(FaultsList);