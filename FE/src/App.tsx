import './App.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import moment from "moment";

import { useFaultManager } from './hooks/useFaultManager';
import NavBar from "./Components/NavBar";
import { hamalRoutes, managerRoutes } from './routesConfig';
import Security from './Security';
import { isHamal } from './utils/roles';

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const faultManager = useFaultManager();

  const routes = !user ? [] : isHamal(user) ? hamalRoutes : managerRoutes;

  useEffect(() => faultManager.setUser(user), [user]);
  useEffect(() => faultManager.setDate(date), [date]);

  return <BrowserRouter>
    <div className="app">
      <NavBar routes={routes} />
      {/* {isHamal(user) && <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />} */}
      <Security user={user} setUser={setUser}>
        <Switch>
          {routes.map(route => <Route key={route.name} {...route} />)}
        </Switch>
      </Security>
    </div>
  </BrowserRouter>;
}

export default App;