import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const SearchBar = styled.div`
  position: relative;
  width: auto;
  min-width: 300px;
`;

const Icon = styled(SearchIcon)`
  width: 70px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled(InputBase)`
  align-self: flex-start;
  color: inherit;
  .search-input {
    color: white;
    padding: 8px 8px 8px 56px;
    width: 100%;
  }
`;

interface SearchInputProps {
  onSearch?(value: string): void;
}
const SearchInput: FunctionComponent<SearchInputProps> = ({ onSearch }) => {
  return (
    <SearchBar>
      <Icon />
      <Input
        onKeyDown={(event: React.KeyboardEvent): void => {
          if (event.key === 'Enter' && onSearch) {
            return onSearch((event.target as HTMLInputElement).value);
          }
        }}
        placeholder='Search…'
        classes={{ input: 'search-input' }}
      />
    </SearchBar>
  );
};

export default SearchInput;
