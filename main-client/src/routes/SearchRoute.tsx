import React, { FunctionComponent, useState } from 'react';
import HeaderMain from '../components/HeaderMain';
import ICardItem from 'shared/interfaces/ICardItem';
import ICardInfo from 'shared/interfaces/ICardInfo';
import styled from 'styled-components';
import theme from '../theme';
import Server from '../utils/parsers/mtgsale-parser-copy';
import { Container, CircularProgress, Backdrop } from '@material-ui/core';
import MtgCardInfo from 'components/MtgCardInfo';
import MtgCardTable from 'components/MtgCardTable';

const StyledBackdrop = styled(Backdrop)`
  z-index: ${theme.zIndex.drawer + 100};
  color: #fff;
`;

const StyledContainer = styled(Container)`
  ${theme.breakpoints.down('xs')} {
    padding: 0;
  }
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

export default SearchRoute;
