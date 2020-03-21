import React, { FunctionComponent } from 'react';
import { Card, CardContent, Typography, Link } from '@material-ui/core';
import ICardItem from 'shared/interfaces/ICardItem';

interface MtgCardProps {
  cardModel: ICardItem;
}

const MtgCard: FunctionComponent<MtgCardProps> = ({ cardModel }) => {
  const { name, price, quantity, language, condition, platformUrl, platform, trader, traderUrl, link } = cardModel;
  return (
    <Card>
      <CardContent>
        <Typography>Имя: {name}</Typography>
        <Typography>Цена: {price}</Typography>
        <Typography>Кол-во: {quantity}</Typography>
        <Typography>Язык: {language}</Typography>
        {condition && <Typography>Состояние: {condition}</Typography>}
        <Typography>
          Магазин: <Link href={platformUrl}>{platform}</Link>
        </Typography>
        {trader && (
          <Typography>
            Продавец: <Link href={traderUrl}>{trader}</Link>
          </Typography>
        )}
        <Link href={link}>Открыть в магазине</Link>
      </CardContent>
    </Card>
  );
};

export default MtgCard;
