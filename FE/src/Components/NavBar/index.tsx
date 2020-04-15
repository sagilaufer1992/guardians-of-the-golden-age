import "./index.scss";

import React, { useState } from 'react';
import classnames from "classnames";

import { useMediaQuery, Theme, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import logo from "../../assets/logo.png";

const pages = [{
    name: "ניהול תקלות",
    icon: AssignmentTurnedInOutlinedIcon
}, {
    name: "תקלה חדשה",
    icon: AssignmentTurnedInOutlinedIcon
}];

export default function NavBar() {
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>(pages[0].name);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const onPageClick = (name: string) => {
        setCurrentPage(name);
    }

    return <AppBar className="nav-bar" position="static">
        <Toolbar className="toolbar">
            <Typography className="title" color="secondary">
                <img className="logo" src={logo} height={isMobile ? 24 : 30} alt="logo" />
                {"משמרות הזהב"}
            </Typography>
            {isMobile ?
                <IconButton edge="end" color="inherit">
                    <MenuIcon onClick={() => setShowDrawer(!showDrawer)} />
                </IconButton> :
                <PagesContainer className="bar-pages" selected={currentPage} onSelect={onPageClick} />}
        </Toolbar>
        <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
            <PagesContainer className="drawer-pages" selected={currentPage} onSelect={onPageClick} />
        </Drawer>
    </AppBar >
}

interface Props {
    selected: string;
    className?: string;
    onSelect: (name: string) => void;
}

const PagesContainer = ({ selected, className, onSelect }: Props) => {
    return <List className={classnames("pages", className || "")}>
        {pages.map(({ name, icon: IconElement }) => {
            const isSelected = selected === name;
            return <ListItem className="page-item">
                <Button
                    className={classnames("page-button", { selected: isSelected })}
                    onClick={() => onSelect(name)}>
                    {<IconElement className="page-icon" />}
                    {name}
                </Button>
            </ListItem>
        })}
    </List>;
}