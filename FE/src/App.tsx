import './App.scss';
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
import { hamalRoutes, managerRoutes } from './routesConfig';
import Security from './Security';
import { isHamal } from './utils/roles';

function App() {
  const [user, setUser] = useState<gg.User | null>(null);

  const routes = !user ? [] : isHamal(user) ? hamalRoutes : managerRoutes;

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