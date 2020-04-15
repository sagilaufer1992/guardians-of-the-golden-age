import "./index.scss";

import React from 'react';

import logo from "../../assets/logo.png";

export default function NavBar() {
    return <div className="app-bar">
        <img className="logo" src={logo} />
        <span>משמרות הזהב - תקלות</span>
    </div>;
}