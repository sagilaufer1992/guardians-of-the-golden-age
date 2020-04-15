import './App.scss';
import React, { useState, useEffect, useRef } from 'react';
import moment from "moment";
import classnames from "classnames";
import { useSnackbar } from "notistack";
import Auth from './Components/Auth';
import UserProvider from './utils/UserProvider';
import Login from "./Components/Auth/Login";
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";
import AddFault from "./Components/AddFault";

import logo from "./assets/logo.png";
import { useMediaQuery, Theme } from '@material-ui/core';
import { isVolunteer } from './utils/roles';
import { useFaultManager } from './hooks/useFaultManager';

const TOKEN_STORAGE_KEY: string = "gg_token";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [authFailed, setAuthFailed] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const faultManager = useFaultManager();

  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  useEffect(() => faultManager.setUser(user), [user]);
  useEffect(() => faultManager.setDate(date), [date]);

  function _handleLogin({ access_token, ...user }: gg.LoginResult) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setUser({ ...user, token: access_token });
    setAuthFailed(null);
  }

  return <div className={classnames("app", { "mobile": isMobile })}>
    <div className="app-bar">
      <img className="logo" src={logo} />
      <span>משמרות הזהב - תקלות</span>
    </div>
    {authFailed ?
      <Login onLogin={_handleLogin} /> :
      !user ?
        <Auth tokenKey={TOKEN_STORAGE_KEY} onSuccess={setUser} onFail={setAuthFailed} /> :
        <UserProvider.Provider value={user}>
          {isMobile && isVolunteer(user) ?
            <AddFault onFaultAdded={faultManager.addFault} /> :
            <div className="app-content">
              <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />
              <div className="content-body">
                {isVolunteer(user) && <AddFault onFaultAdded={faultManager.addFault} />}
                <FaultsArea faults={faultManager.faults} onStatusChange={faultManager.setFaultStatus} onFaultDelete={faultManager.deleteFault} />
              </div>
            </div>}
        </UserProvider.Provider>}
  </div>;
}

export default App;