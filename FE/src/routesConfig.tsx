import React from "react";
import { Home } from "./App";
import AddFault from "./Components/AddFault";
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';

interface Route {
    name: string;
    path: string;
    component: JSX.Element;
    exact: boolean;
    icon: any;
}

export function useRoutes(user: gg.User | null, faultManager: any): Route[] {
    if (user) return [
        { icon: AssignmentTurnedInOutlinedIcon, name: "ניהול תקלות", path: "/", component: <Home user={user} faultManager={faultManager} />, exact: true, },
        { icon: AssignmentTurnedInOutlinedIcon, name: "תקלה חדשה", path: "/add", component: <AddFault onFaultAdded={faultManager.addFault} />, exact: false },
        { icon: AssignmentTurnedInOutlinedIcon, name: "צפי מול ביצוע", path: "/dailyReport", component: <div>תשנה כאן</div>, exact: false },
    ]

    return [];
}