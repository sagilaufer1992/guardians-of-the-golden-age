import "./index.scss";

import React, { useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import classnames from "classnames";
import MenuIcon from '@material-ui/icons/Menu';
import { useMediaQuery, Theme, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, IconButton } from '@material-ui/core';

import logo from "../../assets/logo.png";
import { AppRoute } from "../../routesConfig";

interface Props {
    routes: AppRoute[];
}

export default function NavBar({ routes }: Props) {
    const { pathname } = useLocation();
    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

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
                <PagesContainer className="bar-pages" selected={pathname} routes={routes} />}
        </Toolbar>
        <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
            <PagesContainer className="drawer-pages" selected={pathname} routes={routes} />
        </Drawer>
    </AppBar >
}

interface PageContainerProps {
    selected: string;
    className?: string;
    routes: AppRoute[];
}

const PagesContainer = ({ selected, className, routes }: PageContainerProps) => {
    return <List className={classnames("pages", className || "")}>
        {routes.map(({ name, path, icon: IconElement }) =>
            <ListItem key={name} className="page-item">
                <Link to={path}>
                    <Button
                        className={classnames("page-button", { selected: selected === path })}>
                        <IconElement />
                        {name}
                    </Button>
                </Link>
            </ListItem>
        )}
    </List>;
}