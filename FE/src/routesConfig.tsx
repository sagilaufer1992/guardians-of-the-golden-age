import React from "react";
import { RouteProps } from "react-router-dom";
import { Dashboard as DashboardIcon, AssignmentInd, PostAdd, Create } from "@material-ui/icons";

import AddFault from "./Components/AddFault";
import Dashboard from "./Components/Dashboard";
import FaultsArea from "./Components/FaultsDashboard";
import DeliveryReport from "./Components/DeliveryReport";

export interface AppRoute extends RouteProps {
    name: string;
    path: string;
    icon: React.ComponentType;
    component: React.ComponentType<AppRouteProps>;
}

export interface AppRouteProps {
    date: Date;
    levelAndValue: LevelAndValue;
    setDate: (date: Date) => void;
    setLevelAndValue: (level: Level, value: string | null) => void;
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
}, {
    path: "/deliveryReport",
    name: "טופס ידני",
    component: DeliveryReport as React.ComponentType<AppRouteProps>,
    icon: Create
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
}];
