import "./index.scss";

import React, { useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import classnames from "classnames";
import MenuIcon from '@material-ui/icons/Menu';
import { MdExitToApp } from "react-icons/md";
import { useMediaQuery, Theme, AppBar, Toolbar, Typography, Button, Dialog, DialogContent, DialogTitle, Drawer, List, ListItem, IconButton, Divider } from '@material-ui/core';

import logo from "../../assets/logo.png";
import { AppRoute } from "../../routesConfig";

interface Props {
    routes: AppRoute[];
    user: gg.User | null;
    onLogout: () => void;
}

const NavBar: React.FunctionComponent<Props> = props => {
    const { routes, user, onLogout, children } = props;

    const { pathname } = useLocation();
    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    return <AppBar position="static">
        <Toolbar className="nav-bar">
            <Typography className="title" color="secondary">
                <img className="logo" src={logo} height={isMobile ? 24 : 30} alt="logo" />
                {"משמרות הזהב"}
            </Typography>
            {!isMobile && <PagesContainer className="bar-pages" selected={pathname} routes={routes} />}
            {children}
            {user && <div className="nav-left">
                {!isMobile ?
                    <Button className="page-button logout-button" startIcon={<MdExitToApp />} onClick={onLogout}>התנתק</Button> :
                    <IconButton edge="end" color="inherit">
                        <MenuIcon onClick={() => setShowDrawer(!showDrawer)} />
                    </IconButton>}
            </div>}
        </Toolbar>
        <Drawer className="nav-drawer" anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
            <PagesContainer className="drawer-pages" selected={pathname} routes={routes} />
            <Divider variant="middle" />
            <Button className="page-button logout-button" startIcon={<MdExitToApp />} onClick={onLogout}>התנתק</Button>
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
                        startIcon={<IconElement />}
                        className={classnames("page-button", { selected: selected === path })}>
                        {name}
                    </Button>
                </Link>
            </ListItem>
        )}
    </List>;
}

export default NavBar;