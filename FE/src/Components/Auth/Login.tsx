import "./Login.scss";
import React, { useState } from "react";

import { Button, TextField, Card, Container, CircularProgress } from "@material-ui/core";

import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import { useInput } from "../../utils/hooks";
import { fetchBackend } from "../../utils/fetchHelpers";

interface Props {
    onLogin: (user: gg.LoginResult) => void;
}

const DISABLE_UNDERLINE = { disableUnderline: true };

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useInput("");
    const [usernameValid, setUsernameValid] = useState(true);
    const [password, setPassword] = useInput("");
    const [passwordValid, setPasswordValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function _handleLogin() {
        if (loading) return;

        setUsernameValid(!!username);
        setPasswordValid(!!password);

        if (!username || !password) return setError("אנא מלא את השדות המסומנים");

        setError("");
        setLoading(true);

        try {
            const result = await fetchBackend("/api/login", { method: "POST", body: { username, password } });

            if (result.status === 400) throw "שם המשתמש או הסיסמה אינם נכונים";
            else if (!result.ok) throw "אירעה שגיאה בהתחברות";

            onLogin(await result.json());
        }
        catch (err) {
            setError(typeof err === "string" ? err : "אירעה שגיאה בהתחברות");
            setLoading(false);
        }
    }

    return <Container className="login" maxWidth="sm">
        <Card className="login-container">
            <div className="login-field">
                <PersonRoundedIcon />
                <TextField
                    className="login-input"
                    label="שם משתמש"
                    variant="filled"
                    value={username}
                    error={!usernameValid}
                    onChange={setUsername}
                    InputProps={DISABLE_UNDERLINE}
                />
            </div>
            <div className="login-field">
                <VpnKeyRoundedIcon />
                <TextField
                    className="login-input"
                    label="סיסמה"
                    variant="filled"
                    type="password"
                    value={password}
                    error={!passwordValid}
                    onChange={setPassword}
                    InputProps={DISABLE_UNDERLINE}
                />
            </div>
            {loading && <CircularProgress className="login-loading" size={20} thickness={5} />}
            {error && <div className="login-error">{error}</div>}
        </Card>
        <Button className="login-button" onClick={_handleLogin}>
            <VerifiedUserIcon className="verified-icon" />
            <span>כניסה</span>
        </Button>
    </Container>;
}