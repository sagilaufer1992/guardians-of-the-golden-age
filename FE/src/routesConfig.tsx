import React from "react";
import { RouteProps } from "react-router-dom";
import { Dashboard as DashboardIcon, AssignmentInd, PostAdd, Create } from "@material-ui/icons";

import AddFault from "./Components/AddFault";
import Dashboard from "./Components/Dashboard";
import FaultsArea from "./Components/FaultsArea";
import DeliveryReport from "./Components/DeliveryReport";

export interface AppRoute extends RouteProps {
    name: string;
    path: string;
    icon: React.ComponentType;
    component: React.ComponentType<AppRouteProps>;
}

export interface AppRouteProps {
    date: Date;
    setDate: (date: Date) => void;
}

export const FAULTS_ROUTE = "/faults";

export const hamalRoutes: AppRoute[] = [{
    path: "/",
    exact: true,
    name: "דאשבורד",
    component: Dashboard,
    icon: DashboardIcon
}, {
    path: FAULTS_ROUTE,
    name: "ניהול תקלות",
    component: FaultsArea,
    icon: AssignmentInd
}];

export const managerRoutes: AppRoute[] = [{
    path: "/",
    exact: true,
    name: "תקלה חדשה",
    component: AddFault,
    icon: PostAdd
}, {
    path: FAULTS_ROUTE,
    name: "צפיה בתקלות",
    component: FaultsArea,
    icon: AssignmentInd
},
// {
//     path: "/deliveryReport",
//     name: "טופס ידני",
//     component: DeliveryReport,
//     icon: Create
// }
];
