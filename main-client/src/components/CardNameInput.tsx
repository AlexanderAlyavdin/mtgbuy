import React, { Ref, FunctionComponent } from 'react';
import styled from 'styled-components';
import theme from 'theme';

import { Close as CloseIcon } from '@material-ui/icons';
import { CircularProgress, IconButton, InputAdornment, InputBaseComponentProps, InputBase } from '@material-ui/core';

interface AutocompleteProps {
  ref: Ref<unknown>;
  inputProps: InputBaseComponentProps;
}

interface CardNameInputProps {
  value: string;
  autocompleteProps?: AutocompleteProps;
  showLoadingSpinner: boolean;
  onChange(value: string): void;
}

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;
  input {
    ${theme.breakpoints.down('xs')} {
      font-size: 14px;
    }
  }
`;

const LoadingSpinner = styled(CircularProgress)<{ $visible: boolean }>`
  color: inherit;
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
`;

const StyledIconButton = styled(IconButton)<{ $visible: boolean }>`
  color: inherit;
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
`;

const CardNameInput: FunctionComponent<CardNameInputProps> = ({
  value,
  onChange,
  showLoadingSpinner,
  autocompleteProps,
}) => {
  return (
    <Input
      {...autocompleteProps}
      inputProps={{
        ...autocompleteProps?.inputProps,
        value,
      }}
      onChange={({ target }) => onChange(target.value)}
      placeholder='Введите имя карты для поиска...'
      endAdornment={
        <InputAdornment variant='outlined' position='end'>
          <LoadingSpinner size={20} $visible={showLoadingSpinner} />
          <StyledIconButton size='small' onClick={() => onChange('')} $visible={!!value}>
            <CloseIcon color='inherit' />
          </StyledIconButton>
        </InputAdornment>
      }
    />
  );
};

export default CardNameInput;
