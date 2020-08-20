import React, { FunctionComponent, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { throttle } from 'throttle-debounce';

import { Search as SearchIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import CardNameInput from './CardNameInput';

import Server from '../utils/parsers/mtgsale-parser-copy';

const SearchBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSearchIcon = styled(SearchIcon)`
  flex: 0 0 30px;
  min-height: 20px;
  height: 10vw;
  max-height: 40px;
`;

const StyledAutocomplete = styled(Autocomplete)`
  margin-left: 10px;
  flex: 1 1 300px;
  max-width: 700px;
` as typeof Autocomplete;

interface SearchInputProps {
  onSearch(value: string): void;
}

const SearchInput: FunctionComponent<SearchInputProps> = ({ onSearch }) => {
  const [options, setOptions] = useState<Array<string>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setLoading] = useState(false);

  const getSuggestions = useRef(
    throttle(700, async (value: string) => {
      setLoading(true);
      setOptions(value ? await Server.getSuggestions(value) : []);
      setLoading(false);
    }),
  ).current;

  useEffect(() => {
    getSuggestions(inputValue);
  }, [inputValue]);

  return (
    <SearchBar>
      <StyledSearchIcon />
      <StyledAutocomplete
        onChange={(_e, value) => value && onSearch(value)}
        options={options}
        freeSolo={true}
        renderInput={params => (
          <CardNameInput
            value={inputValue}
            onChange={v => setInputValue(v)}
            showLoadingSpinner={isLoading}
            autocompleteProps={{
              ref: params.InputProps.ref,
              inputProps: params.inputProps,
            }}
          />
        )}
      />
    </SearchBar>
  );
};

export default SearchInput;
