import './App.scss';
import React, { useState } from 'react';
import faults from "./_Mocks/faults";
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";

function App() {
  return (
    <div className="app">
      <DatePanel onDateChanged={date => console.log(date)} />
      <FaultsArea faults={faults} />
    </div>
  );
}

export default App;