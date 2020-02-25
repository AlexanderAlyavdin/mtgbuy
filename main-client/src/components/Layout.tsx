import React, { FunctionComponent } from 'react';
import './Layout.scss';
import HeaderMain from './HeaderMain';

import makeBem from '../utils/make-bem';

const { mainClass, bem } = makeBem('Layout');

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div className={mainClass}>
      <HeaderMain />
      {children}
    </div>
  );
};

export default Layout;
