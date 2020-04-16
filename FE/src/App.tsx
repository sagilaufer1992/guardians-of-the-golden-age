import './App.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { useFaultManager } from './hooks/useFaultManager';
import Security from './Security';
import NavBar from "./Components/NavBar";
import { useRoutes } from './routesConfig';

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