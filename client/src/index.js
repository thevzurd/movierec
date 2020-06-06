import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import Recommendations from './pages/Recommendations';
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux";
import { store } from './store';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffe54c',
      main: '#ffb300',
      dark: '#c68400',
      contrastText: '#000000',
    },
  },
  props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h2',
        h2: 'h2',
        h3: 'h2',
        h4: 'h2',
        h5: 'h2',
        h6: 'h2',
        subtitle1: 'h2',
        subtitle2: 'h2',
        body1: 'span',
        body2: 'span',
      },
    },
  },
});



ReactDOM.render(
  <Provider store={ store }>
    <ThemeProvider theme={ theme }>
      <Router>
        <Route exact path="/" component={ App } />
        <Route path="/recommendations" component={ Recommendations } />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();