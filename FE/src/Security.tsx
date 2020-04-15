import React from "react";
import Auth from './Components/Auth';
import UserProvider from './utils/UserProvider';
import Login from "./Components/Auth/Login";

const TOKEN_STORAGE_KEY: string = "gg_token";

interface Props {
    user: gg.User | null;
    setUser: (user: gg.User) => void;
    authFailed: string | null;
    setAuthFailed: (auth: string | null) => void;
    children?: React.ReactNode;
}

export default function Security({ user, setUser, authFailed, setAuthFailed, children }: Props) {
    function _handleLogin({ access_token, ...user }: gg.LoginResult) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        setUser({ ...user, token: access_token });
        setAuthFailed(null);
    }

    if (authFailed) return <Login onLogin={_handleLogin} />
    else if (!user) return <Auth tokenKey={TOKEN_STORAGE_KEY} onSuccess={setUser} onFail={setAuthFailed} />
    else return <UserProvider.Provider value={user}>
        {children}
    </UserProvider.Provider>
}