import './App.scss';
import React, { useState } from 'react';
import { faults } from "./_Mocks/faults";
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";

function App() {
  return (
    <div className="app">
      <div className="app-bar">משמרות זהב</div>
      <div className="app-content">
        <div className="content-header">
          <DatePanel onDateChanged={date => console.log(date)} />
          <div>עודכן לאחרונה ב- 14:00 03/04/20</div>
        </div>
        <FaultsArea faults={faults} />
      </div>
    </div>
  );
}

export default App;