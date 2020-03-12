import React, { FunctionComponent, useState } from 'react';
import HeaderMain from '../components/HeaderMain';
import ICardItem from 'shared/interfaces/ICardItem';

import getHtmlByCardName from '../utils/parsers/mtgsale-parser-copy';
import { Container, Card, CardContent, Typography, Link, CircularProgress, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const SearchRoute: FunctionComponent = () => {
  const classes = useStyles();

  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);

  const handleSearch = (value: string): Promise<void> => {
    setSearching(true);

    return getHtmlByCardName(value)
      .then(res => setCards(res))
      .finally(() => setSearching(false));
  };

  return (
    <>
      <HeaderMain onSearch={handleSearch} />
      <Container maxWidth='sm'>
        {cards &&
          cards.map((card, index) => (
            <Card key={index}>
              <CardContent>
                <Typography>Имя: {card.name}</Typography>
                <Typography>Цена: {card.price}</Typography>
                <Typography>Кол-во: {card.quantity}</Typography>
                <Typography>Язык: {card.language}</Typography>
                {card.condition && <Typography>Состояние: {card.condition}</Typography>}
                <Typography>
                  Магазин: <Link href={card.platformUrl}>{card.platform}</Link>
                </Typography>
                {card.trader && (
                  <Typography>
                    Продавец: <Link href={card.traderUrl}>{card.trader}</Link>
                  </Typography>
                )}
                <Link href={card.link}>Открыть в магазине</Link>
              </CardContent>
            </Card>
          ))}
      </Container>
      <Backdrop open={searching} className={classes.backdrop}>
        <CircularProgress />
      </Backdrop>
      )
    </>
  );
};

export default SearchRoute;
