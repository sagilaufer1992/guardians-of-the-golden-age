import "./Login.scss";
import React from "react";

import { Button, TextField, Card } from "@material-ui/core";

import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

export default function Login() {
    return <div className="login">
        <Card>
            <div className="login-container">
                <div className="login-field">
                    <PersonRoundedIcon />
                    <TextField
                        className="login-input"
                        label="שם משתמש"
                        variant="filled"
                        type="password"
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                </div>
                <div className="login-field">
                    <VpnKeyRoundedIcon />
                    <TextField
                        className="login-input"
                        label="סיסמה"
                        variant="filled"
                        type="password"
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                </div>
            </div>
        </Card>
        <Button className="login-button">
            <VerifiedUserIcon className="verified-icon" />
            <span>כניסה</span>
        </Button>
    </div >
}