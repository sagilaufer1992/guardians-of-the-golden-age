import "./index.scss";

import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import classnames from "classnames";

import { useMediaQuery, Theme, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import logo from "../../assets/logo.png";

interface Route {
    path: string;
    name: string;
    icon: any;
}

interface Props {
    routes: Route[];
}

export default function NavBar({ routes }: Props) {
    const history = useHistory();
    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const currentPath = window.location.pathname;

    const onPageClick = (path: string) => {
        history.push(path);
    }

    return <AppBar position="static">
        <Toolbar className="nav-bar">
            <Typography className="title" color="secondary">
                <img className="logo" src={logo} height={isMobile ? 24 : 30} alt="logo" />
                {"משמרות הזהב"}
            </Typography>
            {isMobile ?
                <IconButton edge="end" color="inherit">
                    <MenuIcon onClick={() => setShowDrawer(!showDrawer)} />
                </IconButton> :
                <PagesContainer className="bar-pages" selected={currentPath} onSelect={onPageClick} routes={routes} />}
        </Toolbar>
        <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
            <PagesContainer className="drawer-pages" selected={currentPath} onSelect={onPageClick} routes={routes} />
        </Drawer>
    </AppBar >
}

interface PageContainerProps {
    selected: string;
    className?: string;
    onSelect: (name: string) => void;
    routes: Route[];
}

const PagesContainer = ({ selected, className, onSelect, routes }: PageContainerProps) => {
    return <List className={classnames("pages", className || "")}>
        {routes.map(({ name, path, icon: IconElement }) => {
            const isSelected = selected === path;
            return <ListItem key={name} className="page-item">
                <Button
                    className={classnames("page-button", { selected: isSelected })}
                    onClick={() => onSelect(path)}>
                    {<IconElement className="page-icon" />}
                    {name}
                </Button>
            </ListItem>
        })}
    </List>;
}