import "./FaultsMenu.scss";

import React, { useContext } from "react";

import UserProvider from "../../utils/UserProvider";
import DropDownInput from "../Inputs/DropDownInput";
import AutocompleteInput from "../Inputs/AutocompleteInput";

const SORT_BY_OPTIONS = [
    { value: "time", label: "זמן" },
    { value: "status", label: "סטטוס" },
    { value: "category", label: "קטגוריה" },
    { value: "distributionCenter", label: "מרכז חלוקה" }
];

interface Props {
    filters: Record<string, FilterDefinition>;
    onFilterChange: (fieldName: string, value: string) => void;
    onSortChange: (value: string) => void;
}

export default function FaultsMenu(props: Props) {
    const user = useContext(UserProvider);

    const { filters, onFilterChange, onSortChange } = props;

    return <div className="faults-filter">
        {Object.entries(filters).map(([key, value]) => {
            if (value.type === "DropDown") {
                return <DropDownInput {...value} onChange={(value) => onFilterChange(key, value)} />
            }

            return <AutocompleteInput {...value} onChange={(value) => onFilterChange(key, value)} />
        })}
        <DropDownInput title="מיין לפי" defaultValue="time" options={SORT_BY_OPTIONS} onChange={onSortChange} />
    </div>;
}