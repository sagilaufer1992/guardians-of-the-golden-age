import React, { useState } from "react";
import Auth from './Components/Auth';
import { UserProvider } from './utils/UserProvider';
import Login from "./Components/Auth/Login";

const TOKEN_STORAGE_KEY: string = "gg_token";

interface Props {
    user: gg.User | null;
    setUser: (user: gg.User) => void;
    children?: React.ReactNode;
}

export default function Security({ user, setUser, children }: Props) {
    const [authFailed, setAuthFailed] = useState<string | null>(null);

    function _handleLogin({ access_token, ...user }: gg.LoginResult) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        setUser({ ...user, token: access_token });
        setAuthFailed(null);
    }

    function _handleAuthFail(err: string) {
        window.localStorage.clear();
        setAuthFailed(err);
    }

    if (authFailed) return <Login onLogin={_handleLogin} />;
    if (!user) return <Auth tokenKey={TOKEN_STORAGE_KEY} onSuccess={setUser} onFail={_handleAuthFail} />;

    return <UserProvider.Provider value={user}>
        {children}
    </UserProvider.Provider>
}