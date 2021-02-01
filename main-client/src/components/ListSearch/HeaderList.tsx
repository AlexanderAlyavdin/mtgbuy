import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { palette, PaletteProps } from '@material-ui/system';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import SearchInput from './SearchInput';
import { AddBox as PlusIcon, IndeterminateCheckBox as MinusIcon } from '@material-ui/icons';

interface HeaderProps {
  onSearch?(value: string, index: number): void;
}

const ApplicationBar = styled(AppBar)<PaletteProps>`
  ${palette}
`;

const ListToolbar = styled(Toolbar)``;

const HeaderList: FunctionComponent<HeaderProps> = ({ onSearch }) => {
  const [cardList, setCardList] = useState<Array<string>>(['']);

  const setCardName = (index: number, value: string): void => {
    const updatedCardList = cardList.slice();
    updatedCardList[index] = value;
    setCardList(updatedCardList);
  };

  const addCard = (index: number): void => {
    setCardList([...cardList.slice(0, index + 1), '', ...cardList.slice(index + 1, cardList.length)]);
  };

  const removeCard = (index: number): void => {
    setCardList([...cardList.slice(0, index), ...cardList.slice(index + 1, cardList.length)]);
  };

  return (
    <ApplicationBar bgcolor='primary.dark' position='static'>
      {cardList.map((card, index) => (
        <ListToolbar key={index}>
          <SearchInput currentValue={cardList[index]} onSearch={value => setCardName(index, value)} />
          <IconButton onClick={() => addCard(index)} color='inherit' size='small'>
            <PlusIcon />
          </IconButton>
          <IconButton onClick={() => removeCard(index)} color='inherit' size='small'>
            <MinusIcon />
          </IconButton>
        </ListToolbar>
      ))}
    </ApplicationBar>
  );
};

export default HeaderList;
