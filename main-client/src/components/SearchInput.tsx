import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { throttle } from 'throttle-debounce';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Server from '../utils/parsers/mtgsale-parser-copy';
import { CircularProgress, IconButton } from '@material-ui/core';

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
    padding: 8px 8px 8px 0px;
    width: 100%;
  }
`;

interface SearchInputProps {
  onSearch?(value: string): void;
}
const SearchInput: FunctionComponent<SearchInputProps> = ({ onSearch }) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [partName, setPartName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const getSuggestionsThrottled = React.useRef(
    throttle(700, (val: string) => {
      let active = true;

      setLoading(true);
      (async () => {
        const response = await Server.getSuggestions(val);

        if (active) {
          setOptions(response as string[]);
        }
      })().finally(() => setLoading(false));

      return () => {
        active = false;
      };
    }),
  );

  React.useEffect(() => {
    if (partName) {
      getSuggestionsThrottled.current(partName);
    } else {
      setOptions([]);
    }
  }, [partName]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <SearchBar>
      <Icon />
      <Autocomplete
        style={{ paddingLeft: '56px' }}
        open={open && options.length > 0}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={partName}
        onChange={(e: any, value: any) => onSearch && value && onSearch(value)}
        onInputChange={(e, val) => setPartName(val)}
        options={options}
        loading={loading}
        freeSolo={true}
        renderInput={params => (
          <Input
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            placeholder='Search...'
            value={partName}
            onChange={e => setPartName(e.target.value)}
            classes={{ input: 'search-input' }}
            endAdornment={
              <React.Fragment>
                <CircularProgress color='inherit' size={20} style={{ visibility: loading ? 'visible' : 'hidden' }} />
                <IconButton
                  color='inherit'
                  size='small'
                  onClick={e => setPartName('')}
                  style={{ visibility: partName ? 'visible' : 'hidden' }}>
                  <CloseIcon color='inherit' />
                </IconButton>
              </React.Fragment>
            }
          />
        )}
      />
    </SearchBar>
  );
};

export default SearchInput;
