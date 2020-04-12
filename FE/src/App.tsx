import './App.scss';
import React, { useState, useEffect, useRef } from 'react';
import moment from "moment";
import rtl from "jss-rtl";
import { create } from "jss";
import {
  createMuiTheme,
  ThemeProvider,
  Theme,
  StylesProvider,
  jssPreset
} from "@material-ui/core/styles";
import { CircularProgress } from '@material-ui/core';

import Auth from './Auth';
import UserProvider from './utils/UserProvider';
import AuthFailedScreen from "./AuthFailedScreen";
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";
import { getFaultsByDate, updateFault, addFault, deleteFault } from "./utils/fetchFaultFunctions";
import AddFault from "./Components/AddFault";

import logo from "./assets/logo.png";

const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: "Heebo"
  },
  palette: {
    primary: {
      main: "#00a7ff",
      contrastText: "#FFF"
    }
  },
}, { direction: 'rtl' });

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const REFRESH_TIMEOUT: number = 20 * 1000;

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [authFailed, setAuthFailed] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const [faults, setFaults] = useState<Fault[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const lastRefreshTime: React.MutableRefObject<Date | null> = useRef(null);
  const refreshTimeout: React.MutableRefObject<any | null> = useRef(null);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") _refreshFaults();
    });
  }, []);

  useEffect(() => {
    if (user) _refreshFaults();
  }, [date, user]);

  async function _refreshFaults() {
    // can't call _refreshFaults if already refreshing - can cause bugs (change date while refresh)
    // also - stop refreshing when user is not watching
    if (isRefresh || document.hidden) return;

    setIsRefresh(true);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    const newFaults = await getFaultsByDate(user!, date);
    if (!newFaults) return alert("אירעה שגיאה בעדכון התקלות");

    setFaults(newFaults);

    lastRefreshTime.current = new Date();
    refreshTimeout.current = setTimeout(_refreshFaults, REFRESH_TIMEOUT);
    setIsRefresh(false);
  }

  async function _onFaultAdded(newFault: NewFault) {
    const fault = await addFault(user!, newFault);
    if (!fault) return alert("חלה שגיאה בהוספת תקלה");

    setFaults([...faults, fault]);
    _refreshFaults();
  }

  async function _onFaultDelete(id: string) {
    await deleteFault(user!, id);

    setFaults([...faults.filter(f => f._id !== id)]);
    _refreshFaults();
  }

  async function _onStatusChange(faultId: string, status: FaultStatus) {
    const newFault = await updateFault(user!, faultId, { status });
    if (!newFault) return alert("חלה שגיאה בעדכון תקלה");

    setFaults([...faults.filter(f => f._id !== newFault._id), newFault]);
    _refreshFaults();
  }

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <div className="app">
          <div className="app-bar">
            <img className="logo" src={logo} />
            <span>משמרות הזהב - תקלות</span>
          </div>
          {authFailed ?
            <AuthFailedScreen error={authFailed} /> :
            !user ?
              <Auth onSuccess={setUser} onFail={setAuthFailed} /> :
              <UserProvider.Provider value={user}>
                <div className="app-content">
                  <div className="content-header">
                    <DatePanel onDateChanged={setDate} />
                    <div>
                      {isRefresh && <CircularProgress className="fault-fetch-progress" size={15} thickness={5} />}
                      {lastRefreshTime.current && <div className="last-fault-update">עודכן לאחרונה ב- {moment(lastRefreshTime.current).format("HH:mm DD/MM/YYYY")}</div>}
                    </div>
                  </div>
                  <div className="content-body">
                    {user.role !== "hamal" && <AddFault onFaultAdded={_onFaultAdded} />}
                    <FaultsArea faults={faults} onStatusChange={_onStatusChange} onFaultDelete={_onFaultDelete} />
                  </div>
                </div>
              </UserProvider.Provider>}
        </div>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;