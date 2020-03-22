import React, { FunctionComponent } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { History } from 'history';
import TestRoute from './routes/Test';
import SearchRoute from './routes/SearchRoute';
import { palette, PaletteProps } from '@material-ui/system';
import styled, { ThemeProvider } from 'styled-components';
import Box from '@material-ui/core/Box';
import theme from 'theme';
import { StylesProvider } from '@material-ui/styles';

type AppProps = {
  routerHistory: History;
};

const MainBox = styled(Box)<PaletteProps>`
  ${palette}
  min-height: 100vh;
`;

const App: FunctionComponent<AppProps> = ({ routerHistory }) => {
  return (
    <Router history={routerHistory}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MainBox bgcolor='secondary.light'>
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
          </MainBox>
        </ThemeProvider>
      </StylesProvider>
    </Router>
  );
};

export default App;
