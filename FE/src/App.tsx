import './App.scss';
import React, { useState } from 'react';

import Auth from './Auth';
import UserProvider from './utils/UserProvider';
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";

import { faults } from "./_Mocks/faults";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);

  return (
    <div className="app">
      <div className="app-bar">משמרות זהב</div>
      {!user ?
        <Auth onSuccess={setUser} /> :
        <UserProvider.Provider value={user}>
          <div className="app-content">
            <div className="content-header">
              <DatePanel onDateChanged={date => console.log(date)} />
              <div>עודכן לאחרונה ב- 14:00 03/04/20</div>
            </div>
            <FaultsArea faults={faults} />
          </div>
        </UserProvider.Provider>}
    </div>
  );
}

export default App;