import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import getHtmlByCardName from '../utils/parsers/mtgsale-parser-copy';

interface HeaderProps {
  onSearch?(): void;
}

const ApplicationBar = styled(AppBar)``;

const SearchBar = styled.div`
  position: relative;
  background-color: fade(white, 0.15);
  margin-right: 2px;
  margin-left: 0;
  width: auto;
  min-width: 300px;
  &:hover {
    background-color: fade(white, 0.25);
  }
`;

const IconSearch = styled(SearchIcon)`
  width: 70px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled(InputBase)`
  .search-root {
    align-self: flex-start;
    color: inherit;
  }
  .search-input {
    color: white;
    padding: 8px 8px 8px 56px;
    width: 100%;
  }
`;

const handleSearch = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  if (event.key === 'Enter') {
    getHtmlByCardName((event.target as HTMLInputElement).value).then(res => {
      console.log(res);
    });
  }
};

const HeaderMain: FunctionComponent<HeaderProps> = () => {
  return (
    <ApplicationBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Добро пожаловать! Введите имя карты для поиска:</Typography>
        <SearchBar>
          <IconSearch />
          <SearchInput
            onKeyDown={handleSearch}
            placeholder='Search…'
            classes={{
              root: 'search-root',
              input: 'search-input',
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBar>
      </Toolbar>
    </ApplicationBar>
  );
};

export default HeaderMain;
