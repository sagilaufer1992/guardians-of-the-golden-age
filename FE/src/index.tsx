import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import rtl from "jss-rtl";
import { create } from "jss";
import {
  createMuiTheme,
  ThemeProvider,
  Theme,
  StylesProvider,
  jssPreset
} from "@material-ui/core/styles";

import App from './App';
import * as serviceWorker from './serviceWorker';

const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: "Heebo",
    fontSize: 12
  },
  palette: {
    primary: {
      main: "#00a7ff",
      contrastText: "#FFF"
    }
  },
}, { direction: 'rtl' });

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <App />
      </StylesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
