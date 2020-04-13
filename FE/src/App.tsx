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
import { getFaultsByDate, updateFault, addFault, deleteFault } from "./utils/fetchFaultFunctions";
import AddFault from "./Components/AddFault";

import logo from "./assets/logo.png";
import { useMediaQuery, Theme } from '@material-ui/core';
import { isVolunteer } from './utils/roles';

const REFRESH_TIMEOUT: number = 20 * 1000;
const TOKEN_STORAGE_KEY: string = "gg_token";

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<gg.User | null>(null);
  const [authFailed, setAuthFailed] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const [faults, setFaults] = useState<Fault[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const lastRefreshTime: React.MutableRefObject<Date | null> = useRef(null);
  const refreshTimeout: React.MutableRefObject<any | null> = useRef(null);

  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (user && document.visibilityState === "visible") _refreshFaults();
    });
  }, []);

  useEffect(() => {
    if (user) _refreshFaults();
  }, [date, user]);

  function _handleLogin({ access_token, ...user }: gg.LoginResult) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setUser({ ...user, token: access_token });
    setAuthFailed(null);
  }

  async function _refreshFaults() {
    // can't call _refreshFaults if already refreshing - can cause bugs (change date while refresh)
    // also - stop refreshing when user is not watching
    // TODO: MAKE IT WORK FOR MOBILE
    if (isRefresh || document.hidden) return;

    setIsRefresh(true);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    const newFaults = await getFaultsByDate(user!, date);

    if (!newFaults) enqueueSnackbar("אירעה שגיאה בעדכון התקלות", { variant: "error" });
    else {
      setFaults(newFaults);
      lastRefreshTime.current = new Date();
    }

    refreshTimeout.current = setTimeout(_refreshFaults, REFRESH_TIMEOUT);
    setIsRefresh(false);
  }

  async function _onFaultAdded(newFault: NewFault) {
    const fault = await addFault(user!, newFault);
    if (!fault) return enqueueSnackbar("חלה שגיאה בהוספת תקלה", { variant: "error" });

    enqueueSnackbar("התקלה נוספה בהצלחה", { variant: "success" });
    setFaults([...faults, fault]);
    _refreshFaults();
  }

  async function _onFaultDelete(id: string) {
    const fault = await deleteFault(user!, id);
    if (!fault) return enqueueSnackbar("חלה שגיאה מחיקת תקלה", { variant: "error" });

    enqueueSnackbar("התקלה נמחקה בהצלחה", { variant: "success" });
    setFaults([...faults.filter(f => f._id !== id)]);
    _refreshFaults();
  }

  async function _onStatusChange(faultId: string, status: FaultStatus) {
    const newFault = await updateFault(user!, faultId, { status });
    if (!newFault) return enqueueSnackbar("חלה שגיאה בעדכון תקלה", { variant: "error" });

    setFaults([...faults.filter(f => f._id !== newFault._id), newFault]);
    _refreshFaults();
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
            <AddFault onFaultAdded={_onFaultAdded} /> :
            <div className="app-content">
              <DatePanel isRefresh={isRefresh} lastRefreshTime={lastRefreshTime.current} onDateChanged={setDate} />
              <div className="content-body">
                {isVolunteer(user) && <AddFault onFaultAdded={_onFaultAdded} />}
                <FaultsArea faults={faults} onStatusChange={_onStatusChange} onFaultDelete={_onFaultDelete} />
              </div>
            </div>}
        </UserProvider.Provider>}
  </div>;
}

export default App;