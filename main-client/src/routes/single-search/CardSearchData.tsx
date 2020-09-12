import styled from 'styled-components';
import { Container } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { FunctionComponent, useEffect, useState } from 'react';

import ICardInfo from 'shared/interfaces/ICardInfo';
import ICardItem from 'shared/interfaces/ICardItem';

import theme from 'theme';
import MtgCardInfo from 'components/MtgCardInfo';
import MtgCardTable from 'components/MtgCardTable';
import Server from '../../utils/parsers/mtgsale-parser-copy';

const StyledContainer = styled(Container)`
  ${theme.breakpoints.down('xs')} {
    padding: 0;
  }
`;

const CardSearchData: FunctionComponent<{}> = () => {
  const { cardName } = useParams<{ cardName: string }>();
  const [cardInfo, setCardInfo] = useState<ICardInfo | undefined>(undefined);
  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Server.getCardInfo(cardName).then(res => setCardInfo(res));
    Server.searchCards(cardName)
      .then(res => setCards(res))
      .finally(() => setIsLoading(false));
  }, [cardName]);

  return (
    <StyledContainer maxWidth='md'>
      {cardInfo && <MtgCardInfo cardInfo={cardInfo} />}
      <MtgCardTable isLoading={isLoading} cardModels={cards} />
    </StyledContainer>
  );
};

export default CardSearchData;
