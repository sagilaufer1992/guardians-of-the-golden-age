import './App.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import moment from "moment";

import { useFaultManager } from './hooks/useFaultManager';
import Security from './Security';
import NavBar from "./Components/NavBar";
import DatePanel from "./Components/DatePanel";
import { useRoutes } from './routesConfig';
import { isHamal } from "./utils/roles";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [authFailed, setAuthFailed] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const faultManager = useFaultManager();
  const routes = useRoutes(user, faultManager);

  useEffect(() => faultManager.setUser(user), [user]);
  useEffect(() => faultManager.setDate(date), [date]);

  return <Router>
    <div className="app">
      <NavBar routes={routes} />
      <Security user={user} setUser={setUser} authFailed={authFailed} setAuthFailed={setAuthFailed}>
        {user && <div className="app-content">
          {isHamal(user) && <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />}
          <Switch>
            {routes.map(route => <Route key={route.name} exact={route.exact} path={route.path}>
              {route.component}
            </Route>)}
            <Route render={() => <Redirect to="/" />}/>
          </Switch>
        </div>}
      </Security>
    </div>
  </Router >
}

export default App;