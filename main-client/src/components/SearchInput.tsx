import React, { FunctionComponent, ChangeEvent, ReactElement } from 'react';
import styled from 'styled-components';
import { throttle } from 'throttle-debounce';

import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';
import InputBase from '@material-ui/core/InputBase';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Server from '../utils/parsers/mtgsale-parser-copy';
import { CircularProgress, IconButton, InputAdornment } from '@material-ui/core';

const SearchBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled(SearchIcon)`
  flex: 0 0 30px;
  min-height: 20px;
  height: 10vw;
  max-height: 40px;
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;
  .search-input {
    color: inherit;
    padding: 8px 8px 8px 0px;
    width: 100%;
  }
`;

const StyledAutocomplete = styled(Autocomplete)`
  margin-left: 10px;
  flex: 1 1 300px;
  max-width: 700px;
` as typeof Autocomplete;

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
      <StyledAutocomplete
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
            placeholder='Введите имя карты для поиска...'
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
