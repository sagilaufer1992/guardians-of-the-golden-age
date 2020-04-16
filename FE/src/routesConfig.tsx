import React from "react";
import AddFault from "./Components/AddFault";
import ManageFaults from "./Components/ManageFaults";
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

export function useRoutes(user: gg.User | null, faultManager: any): Route[] {
    if (!user) return [];

    return isHamal(user) ?
        [
            { icon: AssignmentTurnedInOutlinedIcon, name: "דאשבורד", path: "/", component: <Dashboard />, exact: true },
            { icon: AssignmentTurnedInOutlinedIcon, name: "ניהול תקלות", path: "/faults", component: <ManageFaults faultManager={faultManager} />, exact: false, },
        ] :
        [
            { icon: AssignmentTurnedInOutlinedIcon, name: "תקלה חדשה", path: "/", component: <AddFault onFaultAdded={faultManager.addFault} />, exact: true },
            { icon: AssignmentTurnedInOutlinedIcon, name: "צפיה בתקלות", path: "/faults", component: <ManageFaults faultManager={faultManager} />, exact: false, },
        ];
}