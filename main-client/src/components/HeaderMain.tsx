import React, { FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import './HeaderMain.scss';

import makeBem from '../utils/make-bem';

const { mainClass, bem } = makeBem('HeaderMain');

const HeaderMain: FunctionComponent = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton edge='start' className={bem('menu-button')} color='inherit' aria-label='menu'>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={bem('title')}>
          Добро пожаловать! Введите имя карты для поиска:
        </Typography>
        <div className={bem('search')}>
          <div className={bem('search-icon')}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder='Search…'
            classes={{
              root: bem('search-root'),
              input: bem('search-input'),
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderMain;
