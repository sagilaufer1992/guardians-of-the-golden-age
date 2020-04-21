import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from "moment";
import "moment/locale/he";
import rtl from "jss-rtl";
import { create } from "jss";
import { SnackbarProvider } from "notistack";
import { createMuiTheme, ThemeProvider, Theme, StylesProvider, jssPreset } from "@material-ui/core/styles";

import App from './App';
import { useMediaQuery, SnackbarOrigin } from '@material-ui/core';
import * as serviceWorker from './serviceWorker';

moment.locale("he");

const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: "Heebo",
    fontSize: 12
  },
  palette: {
    primary: {
      main: "#007aff",
      contrastText: "#FFF"
    },
    secondary: {
      main: "#FFF",
      contrastText: "#007aff"
    }
  },
}, { direction: 'rtl' });

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const DESKTOP_ANCHOR: SnackbarOrigin = { horizontal: "center", vertical: "top" };
const MOBILE_ANCHOR: SnackbarOrigin = { horizontal: "right", vertical: "bottom" };

const Main = () => {
  const mobile = useMediaQuery("(max-width:966px)");

  return <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        anchorOrigin={mobile ? MOBILE_ANCHOR : DESKTOP_ANCHOR}
        classes={{ root: "snackbar-root" }}
        hideIconVariant
        autoHideDuration={2000}
      >
        <StylesProvider jss={jss}>
          <App />
        </StylesProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>;
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
