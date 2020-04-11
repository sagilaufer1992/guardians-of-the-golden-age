import './Auth.scss';
import React, { useEffect } from 'react';
import { CircularProgress } from "@material-ui/core";

import { promiseWithTimeout } from './utils/helpers';

const TOKEN_STORAGE_KEY: string = "gg_token";
const GG_CLIENT: string = process.env.REACT_APP_GG_CLIENT!;

interface Props {
    onSuccess: (user: gg.User) => void;
}

function Auth({ onSuccess }: Props) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") return onSuccess({
            username: "חמל פיתוח",
            role: "hamal",
            token: "VERY_COOL_TOKEN",
            authGroups: []
        });

        promiseWithTimeout(new Promise<string>((resolve, reject) => {
            if (!window.opener) reject("not opened from main application");

            function handleMessage({ origin, data }: MessageEvent) {
                window.removeEventListener("message", handleMessage);
                if (!origin.startsWith(GG_CLIENT) || !data) return;

                window.localStorage.setItem(TOKEN_STORAGE_KEY, data);
                resolve(data);
            }
            
            window.addEventListener("message", handleMessage);
            window.opener.postMessage("ready", "*");
        }), 1000)
            .catch(err => window.localStorage.getItem(TOKEN_STORAGE_KEY))
            .then((token: string | null) => {
                if (!token) throw new Error("no token");

                return promiseWithTimeout(fetch(`${process.env.REACT_APP_GG_API}/auth`, {
                    headers: new Headers({
                        authorization: `Bearer ${token}`
                    })
                })
                    .then(res => res.json())
                    .then(user => ({ ...user, token })), 5000);
            })
            .then(response => response.json())
            .then(onSuccess)
            .catch(() => window.location.href = GG_CLIENT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="auth-container">
        <div className="auth-title">מוודא הרשאות משתמש...</div>
        <CircularProgress className="auth-progress" size={100} thickness={4} />
    </div>;
}

export default Auth;