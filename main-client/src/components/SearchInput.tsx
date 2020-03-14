import React, { FunctionComponent, ChangeEvent, ReactElement } from 'react';
import styled from 'styled-components';
import { throttle } from 'throttle-debounce';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Server from '../utils/parsers/mtgsale-parser-copy';
import { CircularProgress, IconButton, InputAdornment } from '@material-ui/core';

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
  const [partName, setPartName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const getSuggestionsThrottled = React.useRef(
    throttle(700, (val: string) => {
      let active = true;

      setLoading(true);
      (async (): Promise<void> => {
        const response = await Server.getSuggestions(val);

        if (active) {
          setOptions(response as string[]);
        }
      })().finally(() => setLoading(false));

      return (): void => {
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
        onOpen={(): void => setOpen(true)}
        onClose={(): void => setOpen(false)}
        inputValue={partName}
        onChange={(_e: ChangeEvent<{}>, value: string | null): void =>
          onSearch && value ? onSearch(value) : undefined
        }
        onInputChange={(_e, val): void => setPartName(val)}
        options={options}
        loading={loading}
        freeSolo={true}
        renderInput={(params): ReactElement => (
          <Input
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            placeholder='Search...'
            classes={{ input: 'search-input' }}
            endAdornment={
              <InputAdornment variant='outlined' position='end'>
                <CircularProgress color='inherit' size={20} style={{ visibility: loading ? 'visible' : 'hidden' }} />
                <IconButton
                  color='inherit'
                  size='small'
                  onClick={(): void => setPartName('')}
                  style={{ visibility: partName ? 'visible' : 'hidden' }}>
                  <CloseIcon color='inherit' />
                </IconButton>
              </InputAdornment>
            }
          />
        )}
      />
    </SearchBar>
  );
};

export default SearchInput;
