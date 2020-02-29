import React, { FunctionComponent } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { History } from 'history';
import TestRoute from './routes/Test';
import SearchRoute from './routes/SearchRoute';
import { ThemeProvider } from 'styled-components';
import Box from '@material-ui/core/Box';
import theme from './theme';
import { StylesProvider } from '@material-ui/styles';

type AppProps = {
  routerHistory: History;
};

const App: FunctionComponent<AppProps> = ({ routerHistory }) => {
  return (
    <Router history={routerHistory}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Box>
            <Switch>
              <Route exact path='/'>
                <SearchRoute />
              </Route>
              <Route path='/about'>
                <div>Route About</div>
              </Route>
              <Route path='/test'>
                <TestRoute />
              </Route>
            </Switch>
          </Box>
        </ThemeProvider>
      </StylesProvider>
    </Router>
  );
};

export default App;
