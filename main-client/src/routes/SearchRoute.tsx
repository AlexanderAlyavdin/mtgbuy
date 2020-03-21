import React, { FunctionComponent, useState } from 'react';
import HeaderMain from '../components/HeaderMain';
import ICardItem from 'shared/interfaces/ICardItem';
import ICardInfo from 'shared/interfaces/ICardInfo';
import styled from 'styled-components';
import theme from '../theme';
import Server from '../utils/parsers/mtgsale-parser-copy';
import { Container, CircularProgress, Backdrop } from '@material-ui/core';
import MtgCard from 'components/MtgCard';
import MtgCardInfo from 'components/MtgCardInfo';

const StyledBackdrop = styled(Backdrop)`
  z-index: ${theme.zIndex.drawer} + 1;
  color: '#fff';
`;

const SearchRoute: FunctionComponent = () => {
  const [cardInfo, setCardInfo] = useState<ICardInfo | undefined>(undefined);
  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);

  const handleSearch = (value: string): Promise<void> => {
    setSearching(true);

    Server.getCardInfo(value).then(res => setCardInfo(res));

    return Server.searchCards(value)
      .then(res => setCards(res))
      .finally(() => setSearching(false));
  };

  return (
    <>
      <HeaderMain onSearch={handleSearch} />
      <Container maxWidth='md'>{cardInfo && <MtgCardInfo cardInfo={cardInfo} />}</Container>
      <Container maxWidth='md'>
        {cards && cards.map((card, index) => <MtgCard key={index} cardModel={card} />)}
      </Container>
      <StyledBackdrop open={searching}>
        <CircularProgress />
      </StyledBackdrop>
      )
    </>
  );
};

export default SearchRoute;
