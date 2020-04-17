import React from "react";
import AddFault from "./Components/AddFault";
import FaultsArea from "./Components/FaultsArea";
import Dashboard from "./Components/Dashboard";
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import { isHamal } from "./utils/roles";

interface Route {
    name: string;
    path: string;
    component: JSX.Element;
    exact: boolean;
    icon: any;
}

export function useRoutes(user: gg.User | null, faultManager: FaultManager): Route[] {
    if (!user) return [];

    const { faults, addFault, deleteFault, setFaultStatus, level } = faultManager;

    const hamalOptions = [
        {
            name: "דאשבורד",
            path: "/",
            component: <Dashboard faultsManager={faultManager} />,
            exact: true,
            icon: AssignmentTurnedInOutlinedIcon
        }
    ];

    if (level) hamalOptions.push({
        name: "ניהול תקלות",
        path: "/faults",
        component: <FaultsArea faults={faults} onStatusChange={setFaultStatus} />,
        exact: false,
        icon: AssignmentTurnedInOutlinedIcon
    });
    
    return isHamal(user) ?
        hamalOptions :
        [
            {
                icon: AssignmentTurnedInOutlinedIcon,
                name: "תקלה חדשה",
                path: "/",
                component: <AddFault onFaultAdded={addFault} />,
                exact: true
            },
            {
                icon: AssignmentTurnedInOutlinedIcon,
                name: "צפיה בתקלות",
                path: "/faults",
                component: <FaultsArea faults={faults} onFaultDelete={deleteFault} />,
                exact: false,
            },
        ];
}