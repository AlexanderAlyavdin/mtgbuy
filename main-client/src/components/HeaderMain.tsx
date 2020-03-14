import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchInput from './SearchInput';

interface HeaderProps {
  onSearch?(value: string): void;
}

const ApplicationBar = styled(AppBar)``;

const HeaderMain: FunctionComponent<HeaderProps> = ({ onSearch }) => {
  return (
    <ApplicationBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Добро пожаловать! Введите имя карты для поиска:</Typography>
        <SearchInput onSearch={(value: string): void => onSearch && onSearch(value)} />
      </Toolbar>
    </ApplicationBar>
  );
};

export default HeaderMain;
