import './App.scss';
import React, { useState, useEffect, useRef } from 'react';
import moment from "moment";
import Auth from './Auth';
import UserProvider from './utils/UserProvider';
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";
import { getFaultsByDate, updateFault, addFault } from "./utils/fetchFaultFunctions";
import AddFault from "./Components/AddFault";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const [faults, setFaults] = useState<Fault[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const lastRefreshTime: React.MutableRefObject<Date | null> = useRef(null);

  useEffect(() => {
    if (user) _refreshFaults();
  }, [date, user]);

  async function _refreshFaults() {
    // can't call _refreshFaults if already refreshing - can cause bugs (change date while refresh)
    if (isRefresh) return;

    setIsRefresh(true);

    const newFaults = await getFaultsByDate(user!, date);
    if (!newFaults) return alert("אירעה שגיאה בעדכון התקלות");
    
    setFaults(newFaults);

    lastRefreshTime.current = new Date();
    setIsRefresh(false);
  }

  async function _onFaultAdded(newFault: NewFault) {
    const fault = await addFault(user!, newFault);
    if (!fault) return alert("חלה שגיאה בהוספת תקלה");

    setFaults([...faults, fault]);
    _refreshFaults();
  }

  async function _onStatusChange(faultId: string, status: FaultStatus) {
    const newFault = await updateFault(user!, faultId, { status });
    if (!newFault) return alert("חלה שגיאה בעדכון תקלה");

    setFaults([...faults.filter(f => f._id !== newFault._id), newFault]);
    _refreshFaults();
  }

  return (
    <div className="app">
      <div className="app-bar">משמרות הזהב - תקלות</div>
      {!user ?
        <Auth onSuccess={setUser} /> :
        <UserProvider.Provider value={user}>
          <div className="app-content">
            <div className="content-header">
              <DatePanel onDateChanged={setDate} />
              {lastRefreshTime.current && <div>עודכן לאחרונה ב- {moment(lastRefreshTime.current).format("HH:mm DD/MM/YYYY")}</div>}
            </div>
            <div className="content-body">
              <AddFault onFaultAdded={_onFaultAdded} />
              <FaultsArea faults={faults} onStatusChange={_onStatusChange} />
            </div>
          </div>
        </UserProvider.Provider>}
    </div>
  );
}

export default App;