import "./HierarchyNavigator.scss";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

interface Props {
    levelAndValue: { level: Level, value: string | null; }
    onHierarchyChanged: (level: Level, value: string | null) => void;
}

export default function HierarchyNavigator({ levelAndValue, onHierarchyChanged }: Props) {
    const [fetchApi] = useApi("/api/branches");
    const [currentHierarchy, setCurrentHierarchy] = useState<Partial<Hierarchy>>({});

    useEffect(() => { _initBranchInfo(levelAndValue.level, levelAndValue.value); }, [levelAndValue]);

    async function _initBranchInfo(level: Level, levelValue: string | null) {
        if (!level || level === "national") return setCurrentHierarchy({});

        if (!levelValue) return;

        if (level === "district") return setCurrentHierarchy({ district: levelValue });

        const branch = await fetchApi<Branch>({ route: `/fromInfo?${level}=${levelValue}` });
        if (!branch) return;

        if (level === "napa")
            return setCurrentHierarchy({ district: branch.district, napa: levelValue });

        if (level === "municipality")
            return setCurrentHierarchy({ district: branch.district, napa: branch.napa, municipality: levelValue });
    }

    const onNationalClick = () => onHierarchyChanged("national", null);
    const onDistrictClick = () => onHierarchyChanged("district", currentHierarchy.district!);
    const onNapaClick = () => onHierarchyChanged("napa", currentHierarchy.napa!);

    return <div className="hierarchy-navigator">
        <span className="title">היררכיה נוכחית:</span>
        <Breadcrumbs dir="rtl" className="hierarchy-breadcrumbs">
            <Link onClick={onNationalClick}>ארצי</Link>
            {currentHierarchy.district && <Link onClick={onDistrictClick}>{currentHierarchy.district}</Link>}
            {currentHierarchy.napa && <Link onClick={onNapaClick}>{currentHierarchy.napa}</Link>}
            {currentHierarchy.municipality && <Link>{currentHierarchy.municipality}</Link>}
        </Breadcrumbs>
    </div>
};