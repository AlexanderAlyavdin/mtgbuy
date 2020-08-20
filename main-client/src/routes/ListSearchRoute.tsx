import React, { FunctionComponent, useState } from 'react';
import HeaderList from '../components/ListSearch/HeaderList';
import ICardItem from 'shared/interfaces/ICardItem';
import ICardInfo from 'shared/interfaces/ICardInfo';
import styled from 'styled-components';
import theme from '../theme';
import Server from '../utils/parsers/mtgsale-parser-copy';
import { Container, CircularProgress, Backdrop } from '@material-ui/core';
import MtgCardInfo from 'components/MtgCardInfo';
import MtgCardTable from 'components/MtgCardTable';
import HeaderMain from 'components/HeaderMain';

const StyledBackdrop = styled(Backdrop)`
  z-index: ${theme.zIndex.drawer + 100};
  color: #fff;
`;

const StyledContainer = styled(Container)`
  ${theme.breakpoints.down('xs')} {
    padding: 0;
  }
`;

const ListSearchRoute: FunctionComponent = () => {
  const [cardInfo, setCardInfo] = useState<ICardInfo | undefined>(undefined);
  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);

  // const [cardList, setCardList] = useState<Array<string>>(['1', '2']);

  // const handleSearch = (value: string, index): Promise<void> => {
  //   setSearching(true);

  //   Server.getCardInfo(value).then(res => setCardInfo(res));

  //   return Server.searchCards(value)
  //     .then(res => setCards(res))
  //     .finally(() => setSearching(false));
  // };

  return (
    <>
      <HeaderList />
      {searching ? (
        <StyledBackdrop open={searching}>
          <CircularProgress />
        </StyledBackdrop>
      ) : (
        <StyledContainer maxWidth='md'>
          {cardInfo && <MtgCardInfo cardInfo={cardInfo} />}
          {cards && <MtgCardTable cardModels={cards} />}
        </StyledContainer>
      )}
    </>
  );
};

export default ListSearchRoute;
