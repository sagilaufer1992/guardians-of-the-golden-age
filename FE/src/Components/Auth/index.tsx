import './index.scss';
import React, { useEffect } from 'react';
import { CircularProgress } from "@material-ui/core";

import { promiseWithTimeout } from '../../utils/helpers';
import { fetchBackend } from "../../utils/fetchHelpers";

const GG_CLIENT: string = process.env.REACT_APP_GG_CLIENT!;

interface Props {
    tokenKey: string;
    onSuccess: (user: gg.User) => void;
    onFail: (err: string) => void;
}

function Auth({ tokenKey, onSuccess, onFail }: Props) {
    useEffect(() => {
        promiseWithTimeout(new Promise<string>((resolve, reject) => {
            if (process.env.NODE_ENV === "development") return resolve("VERY_COOL_TOKEN");

            if (!window.opener) return reject("not opened from main application");

            function handleMessage({ origin, data }: MessageEvent) {
                window.removeEventListener("message", handleMessage);
                if (!origin.startsWith(GG_CLIENT) || !data) return;

                window.localStorage.setItem(tokenKey, data);
                resolve(data);
            }

            window.addEventListener("message", handleMessage);
            window.opener.postMessage("ready", "*");
        }), 1000)
            .catch(err => window.localStorage.getItem(tokenKey))
            .then((token: string | null) => {
                if (!token) throw new Error("no token");

                return promiseWithTimeout(fetchBackend("/api/auth", { token })
                    .then(res => res.json())
                    .then(user => ({ ...user, token })), 5000);
            })
            .then(onSuccess)
            .catch(onFail);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="auth-container">
        <div className="auth-title">מוודא הרשאות משתמש...</div>
        <CircularProgress className="auth-progress" size={100} thickness={4} />
    </div>;
}

export default Auth;