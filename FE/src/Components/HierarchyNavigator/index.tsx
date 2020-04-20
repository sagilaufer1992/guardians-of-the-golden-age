import "./index.scss";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

interface Props {
    level?: string | null;
    levelValue?: string | null;
}

export default React.memo(function HierarchyNavigator({ level, levelValue }: Props) {
    const [fetchApi] = useApi();
    const [currentHierarchy, setCurrentHierarchy] = useState<Partial<Hierarchy>>({});

    useEffect(() => {
        if (!level || level === "national") {
            setCurrentHierarchy({});
            console.log(currentHierarchy);
        }
        else if (level === "district" && levelValue) {
            setCurrentHierarchy({ district: levelValue });
            console.log(currentHierarchy);
        }
        else {
            const branchesPromise = fetchApi<Branch[]>({ route: "/api/branches" });
            branchesPromise.then(branches => {
                if (level === "napa" && levelValue) {
                    const relevantBranch = branches?.find(b => b.napa === levelValue);
                    setCurrentHierarchy({ district: relevantBranch?.district, napa: levelValue });
                    console.log(currentHierarchy);
                } else if (level === "municipality" && levelValue) {
                    const relevantBranch = branches?.find(b => b.municipality === levelValue);
                    setCurrentHierarchy({ district: relevantBranch?.district, napa: relevantBranch?.napa, municipality: levelValue });
                    console.log(currentHierarchy);
                }
            });
        }
    }, [level]);

    return <div className="hierarchy-navigator">
        <div className="title">היררכיה נוכחית:</div>
        <Breadcrumbs dir="rtl">
            <Link>ארצי</Link>
            {currentHierarchy.district && <Link>{currentHierarchy.district}</Link>}
            {currentHierarchy.napa && <Link>{currentHierarchy.napa}</Link>}
            {currentHierarchy.municipality && <Link>{currentHierarchy.municipality}</Link>}
        </Breadcrumbs>
    </div>
});

