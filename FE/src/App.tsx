import './App.scss';
import moment from 'moment';
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
import Security from './Security';
import HierarchyNavigator from "./Components/HierarchyNavigator";
import { hamalRoutes, managerRoutes } from './routesConfig';
import { isHamal } from './utils/roles';
import { UserProvider } from './utils/UserProvider';

const LEVEL_KEY = "dashboard_level";
const LEVEL_VALUE_KEY = "dashboard_level_value";

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());
  const [levelAndValue, setLevelAndValue] = useState<LevelAndValue>({
    level: (window.localStorage.getItem(LEVEL_KEY) as Level) ?? "national",
    value: window.localStorage.getItem(LEVEL_VALUE_KEY) ?? null
  });

  const _onHierarchyChanged = (level: Level, value: string | null) => {
    if (value) window.localStorage.setItem(LEVEL_VALUE_KEY, value);
    else window.localStorage.removeItem(LEVEL_VALUE_KEY);

    window.localStorage.setItem(LEVEL_KEY, level);

    setLevelAndValue({ level, value });
  }

  const routes = !user ? [] : isHamal(user) ? hamalRoutes : managerRoutes;

  function _logOut() {
    window.localStorage.clear();
    window.location.reload();
  }

  return <BrowserRouter>
    <div className="app">
      <NavBar user={user} routes={routes} onLogout={_logOut}>
        {user && isHamal(user) && <UserProvider.Provider value={user}>
          <HierarchyNavigator levelAndValue={levelAndValue} onHierarchyChanged={_onHierarchyChanged} />
        </UserProvider.Provider>}
      </NavBar>
      <Security user={user} setUser={setUser}>
        <Switch>
          {routes.map(({ component: Component, ...route }) => <Route key={route.name} {...route}
            render={props => <Component {...props} date={date} setDate={setDate} levelAndValue={levelAndValue} setLevelAndValue={_onHierarchyChanged} />} />)}
        </Switch>
      </Security>
    </div>
  </BrowserRouter>;
}

export default App;