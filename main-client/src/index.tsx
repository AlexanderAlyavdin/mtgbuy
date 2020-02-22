import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { createBrowserHistory } from 'history';

ReactDOM.render(<App routerHistory={createBrowserHistory()} />, document.getElementById('root'));
