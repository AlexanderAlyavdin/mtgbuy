import React, { FunctionComponent } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { History } from 'history';
import Layout from './components/Layout';
import TestRoute from './routes/Test';

type AppProps = {
  routerHistory: History;
};

const App: FunctionComponent<AppProps> = ({ routerHistory }) => {
  return (
    <Router history={routerHistory}>
      <Layout>
        <Switch>
          <Route exact path='/'>
            <div>Route Index</div>
          </Route>
          <Route path='/about'>
            <div>Route About</div>
          </Route>
          <Route path='/test'>
            <TestRoute />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
