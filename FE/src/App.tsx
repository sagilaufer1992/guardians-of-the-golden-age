import './App.scss';
import moment from 'moment';
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
import { hamalRoutes, managerRoutes } from './routesConfig';
import Security from './Security';
import { isHamal } from './utils/roles';

function App() {
  const [user, setUser] = useState<gg.User | null>(null);
  const [date, setDate] = useState<Date>(moment().startOf('day').toDate());

  const routes = !user ? [] : isHamal(user) ? hamalRoutes : managerRoutes;

  return <BrowserRouter>
    <div className="app">
      <NavBar routes={routes} />
      <Security user={user} setUser={setUser}>
        <Switch>
          {routes.map(({ component: Component, ...route }) => <Route key={route.name} {...route}
            render={props => <Component {...props} date={date} setDate={setDate} />} />)}
        </Switch>
      </Security>
    </div>
  </BrowserRouter>;
}

export default App;