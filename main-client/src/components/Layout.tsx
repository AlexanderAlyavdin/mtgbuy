import React, { FunctionComponent } from 'react';
import './Layout.scss';

import makeBem from '../utils/make-bem';

const { mainClass, bem } = makeBem('Layout');

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div className={mainClass}>
      <header className={bem('header')}>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {children}
      </header>
    </div>
  );
};

export default Layout;
