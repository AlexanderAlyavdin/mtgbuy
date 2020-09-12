import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { palette, PaletteProps } from '@material-ui/system';
import { AppBar, Toolbar } from '@material-ui/core';
import SearchInput from '../../components/SearchInput';

interface HeaderProps {
  onSearch?(value: string): void;
}

const ApplicationBar = styled(AppBar)<PaletteProps>`
  ${palette}
`;

const HeaderMain: FunctionComponent<HeaderProps> = ({ onSearch }) => {
  return (
    <ApplicationBar bgcolor='primary.dark' position='static'>
      <Toolbar>
        <SearchInput onSearch={(value: string): void => onSearch && onSearch(value)} />
      </Toolbar>
    </ApplicationBar>
  );
};

export default HeaderMain;
