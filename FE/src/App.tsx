import './App.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import moment from "moment";
import classnames from "classnames";
import { useSnackbar } from "notistack";
import FaultsArea from "./Components/FaultsArea";
import DatePanel from "./Components/DatePanel";
import AddFault from "./Components/AddFault";
import NavBar from "./Components/NavBar";

import { useMediaQuery, Theme } from '@material-ui/core';
import { isVolunteer } from './utils/roles';
import { useFaultManager } from './hooks/useFaultManager';
import Security from './Security';
import { useRoutes } from './routesConfig';

interface HomeProps {
  user: gg.User,
  faultManager: any,
}

export function Home({ user, faultManager }: HomeProps) {
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  useEffect(() => faultManager.setDate(date), [date]);

  if (isMobile && user && isVolunteer(user))
    return <FaultsArea faults={faultManager.faults} onStatusChange={faultManager.setFaultStatus} onFaultDelete={faultManager.deleteFault} />
  else return <div className="app-content">
    <DatePanel isRefresh={faultManager.isRefresh} lastRefreshTime={faultManager.lastRefreshTime} onDateChanged={setDate} />
    <div className="content-body">
      {user && isVolunteer(user) && <AddFault onFaultAdded={faultManager.addFault} />}
      <FaultsArea faults={faultManager.faults} onStatusChange={faultManager.setFaultStatus} onFaultDelete={faultManager.deleteFault} />
    </div>
  </div>
}

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [authFailed, setAuthFailed] = useState<string | null>(null);
  const faultManager = useFaultManager();
  const routes = useRoutes(user, faultManager);

  useEffect(() => faultManager.setUser(user), [user]);

  return <Router>
    <div className="app">
      <NavBar routes={routes} />
      <Security user={user} setUser={setUser} authFailed={authFailed} setAuthFailed={setAuthFailed}>
        {user &&
          <Switch>
            {routes.map(route => <Route key={route.name} exact={route.exact} path={route.path}>
              {route.component}
            </Route>)}
          </Switch>}
      </Security>
    </div>
  </Router >
}

export default App;