import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Server from '../utils/parsers/mtgsale-parser-copy';

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

  React.useEffect(() => {
    let active = true;

    setLoading(true);
    (async () => {
      const response = await Server.getSuggestions(partName).finally(() => setLoading(false));

      if (active) {
        setOptions(response as string[]);
      }
    })();

    return () => {
      active = false;
    };
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
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(e: any, value: any) => onSearch && value && onSearch(value)}
        options={options}
        loading={loading}
        loadingText={'Loading...'}
        freeSolo={true}
        renderInput={params => (
          <Input
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            placeholder='Search...'
            onChange={e => setPartName(e.target.value)}
            classes={{ input: 'search-input' }}
          />
        )}
      />
    </SearchBar>
  );
};

export default SearchInput;
