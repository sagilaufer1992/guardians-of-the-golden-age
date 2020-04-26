import "./index.scss";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Dialog, DialogContent, DialogTitle, Tooltip } from "@material-ui/core";
import EditLocationIcon from '@material-ui/icons/EditLocation';

import { useApi } from "../../hooks/useApi";
import Initializer from "./Initializer";

interface Props {
    levelAndValue: { level: Level, value: string | null; }
    onHierarchyChanged: (level: Level, value: string | null) => void;
}

export default function HierarchyNavigator({ levelAndValue, onHierarchyChanged }: Props) {
    const [fetchApi] = useApi("/api/branches");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
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

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const onNationalClick = () => onHierarchyChanged("national", null);
    const onDistrictClick = () => onHierarchyChanged("district", currentHierarchy.district!);
    const onNapaClick = () => onHierarchyChanged("napa", currentHierarchy.napa!);

    const onInitialize = (level: Level, value: string | null) => {
        onHierarchyChanged(level, value);
        setModalOpen(false);
    }

    return <div className="hierarchy-navigator">
        <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="lg">
            <DialogTitle>בחר היררכיה</DialogTitle>
            <DialogContent style={{ width: 400 }}>
                <Initializer onInitialize={onInitialize} />
            </DialogContent>
        </Dialog>
        <Tooltip title="לחץ לשינוי היררכיה" placement="top">
            <EditLocationIcon className="select-hierarchy-button" onClick={handleModalOpen} />
        </Tooltip>
        <Breadcrumbs dir="rtl" color="secondary" className="hierarchy-breadcrumbs" >
            <Link onClick={onNationalClick}>ארצי</Link>
            {currentHierarchy.district && <Link onClick={onDistrictClick}>{currentHierarchy.district}</Link>}
            {currentHierarchy.napa && <Link onClick={onNapaClick}>{currentHierarchy.napa}</Link>}
            {currentHierarchy.municipality && <Link>{currentHierarchy.municipality}</Link>}
        </Breadcrumbs>
    </div>;
};