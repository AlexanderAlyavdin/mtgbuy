import React, { FunctionComponent, useState } from 'react';
import HeaderMain from '../components/HeaderMain';
import ICardItem from 'shared/interfaces/ICardItem';
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
  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);

  const handleSearch = (value: string): Promise<void> => {
    setSearching(true);

    return Server.searchCards(value)
      .then(res => setCards(res))
      .finally(() => setSearching(false));
  };

  const cardInfo = {
    name: 'Golos',
    imageUrl: 'https://magicalter.com/wp-content/uploads/2020/01/Golos-mtg-alters.jpg',
    description:
      'When Golos, Tireless Pilgrim enters the battlefield, you may search your library for a land card, put that card onto the battlefield tapped, then shuffle your library.',
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
