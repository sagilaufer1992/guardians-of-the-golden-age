import React from "react";
import { RouteProps } from "react-router-dom";
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';

import AddFault from "./Components/AddFault";
import Dashboard from "./Components/Dashboard";
import FaultsArea from "./Components/FaultsArea";
import DeliveryReport from "./Components/DeliveryReport";

export interface AppRoute extends RouteProps {
    name: string;
    path: string;
    icon: React.ComponentType;
}

export const FAULTS_ROUTE = "/faults";

export const hamalRoutes: AppRoute[] = [{
    path: "/",
    exact: true,
    name: "דאשבורד",
    component: Dashboard,
    icon: AssignmentTurnedInOutlinedIcon
}, {
    path: FAULTS_ROUTE,
    name: "ניהול תקלות",
    component: FaultsArea,
    icon: AssignmentTurnedInOutlinedIcon
}];

export const managerRoutes: AppRoute[] = [{
    path: "/",
    exact: true,
    name: "תקלה חדשה",
    component: AddFault,
    icon: AssignmentTurnedInOutlinedIcon
}, {
    path: FAULTS_ROUTE,
    name: "צפיה בתקלות",
    component: FaultsArea,
    icon: AssignmentTurnedInOutlinedIcon
}, {
    path: "/deliveryReport",
    name: "טופס ידני",
    component: DeliveryReport,
    icon: AssignmentTurnedInOutlinedIcon
},];
