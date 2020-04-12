import "./AuthFailedScreen.scss";
import React from "react";

import loginImg from "./assets/golden-guard-login.png";
//import openFaultsImg from "./assets/golden-guard-open-faults.png";
import newNavbarImg from "./assets/golden-guard-new-navbar.jpeg";

interface Props {
    error: string;
}

export default function AuthFailedScreen({ error }: Props) {
    return <div className="auth-failed-container">
        <div className="title">לא הצלחנו לקבל את פרטי המשתמש</div>
        <div className="content">
            <div className="description-text">
                כדי שנוכל לדעת מי אתם, אנא בצעו את השלבים הבאים:
            </div>
            <div className="step">
                <div className="step-text">
                    {"1. "}
                    <a href={process.env.REACT_APP_GG_CLIENT!}>גלשו לדף ההתחברות</a>
                    {" והכניסו את פרטיכם:"}
                </div>
                <img src={loginImg} />
            </div>
            <div className="step">
                <div className="step-text">
                    {"2. "}
                    לחצו על כפתור "ניהול תקלות" שבצד ימין למעלה:
                </div>
                <img src={newNavbarImg} />
            </div>
        </div>
    </div>
}