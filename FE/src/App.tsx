import './App.scss';
import React, { useState, useEffect } from 'react';
import moment from "moment";
import Auth from './Auth';
import UserProvider from './utils/UserProvider';
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";
import { getFaultsByDate, updateFault } from "./utils/fetchFaultFunctions";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const [faults, setFaults] = useState<Fault[]>([]);

  useEffect(() => {
    async function fetchFaults() {
      const response = await getFaultsByDate(date);
      setFaults(response);
    }

    fetchFaults();
  }, [date]);

  async function _onFaultChange(fault: Fault) {
    const newFault = await updateFault(fault);
    setFaults([...faults.filter(f => f._id !== newFault._id), newFault])
  }

  function _onDateChange(date: Date) {
    setDate(date);
  }

  return (
    <div className="app">
      <div className="app-bar">משמרות זהב</div>
      {!user ?
        <Auth onSuccess={setUser} /> :
        <UserProvider.Provider value={user}>
          <div className="app-content">
            <div className="content-header">
              <DatePanel onDateChanged={_onDateChange} />
              <div>עודכן לאחרונה ב- 14:00 03/04/20</div>
            </div>
            <FaultsArea faults={faults} onFaultChange={_onFaultChange}/>
          </div>
        </UserProvider.Provider>}
    </div>
  );
}

export default App;