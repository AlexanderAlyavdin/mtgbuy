import React, { FunctionComponent, useState, useEffect } from 'react';
import HeaderMain from '../components/HeaderMain';
import ICardItem from 'shared/interfaces/ICardItem';

import getHtmlByCardName from '../utils/parsers/mtgsale-parser-copy';
import { Container, Card, CardContent, Typography, Link } from '@material-ui/core';

const SearchRoute: FunctionComponent = () => {
  const [cards, setCards] = useState<Array<ICardItem> | undefined>(undefined);

  const handleSearch = (value: string): Promise<void> => getHtmlByCardName(value).then(res => setCards(res));

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
    </>
  );
};

export default SearchRoute;
