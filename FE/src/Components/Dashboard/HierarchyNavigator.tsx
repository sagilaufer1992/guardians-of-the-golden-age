import "./HierarchyNavigator.scss";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

interface Props {
    levelAndValue: { level: Level, value: string | null; }
}

export default function HierarchyNavigator({ levelAndValue }: Props) {
    const [fetchApi] = useApi("/api/branches");
    const [currentHierarchy, setCurrentHierarchy] = useState<Partial<Hierarchy>>({});

    useEffect(() => { _initBranchInfo(levelAndValue.level, levelAndValue.value); }, [levelAndValue]);

    async function _initBranchInfo(level: Level, levelValue: string | null) {
        if (!level || level === "national") return setCurrentHierarchy({});

        if (!levelValue) return;

        if (level === "district") return setCurrentHierarchy({ district: levelValue });

        const branch = await fetchApi<Branch>({ route: `/fromValue?level=${level}&value=${levelValue}` });
        if (!branch) return;

        if (level === "napa")
            return setCurrentHierarchy({ district: branch.district, napa: levelValue });

        if (level === "municipality")
            setCurrentHierarchy({ district: branch.district, napa: branch.napa, municipality: levelValue });
    }

    return <div className="hierarchy-navigator">
        <span className="title">היררכיה נוכחית:</span>
        <Breadcrumbs dir="rtl" className="hierarchy-breadcrumbs">
            <Link>ארצי</Link>
            {currentHierarchy.district && <Link>{currentHierarchy.district}</Link>}
            {currentHierarchy.napa && <Link>{currentHierarchy.napa}</Link>}
            {currentHierarchy.municipality && <Link>{currentHierarchy.municipality}</Link>}
        </Breadcrumbs>
    </div>
};