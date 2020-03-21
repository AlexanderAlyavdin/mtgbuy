import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, CardHeader, CardMedia, Container } from '@material-ui/core';
import ICardInfo from 'shared/interfaces/ICardInfo';

interface MtgCardInfoProps {
  cardInfo: ICardInfo;
}

const Header = styled(CardHeader)`
  text-align: center;
`;

const Image = styled(CardMedia)`
  height: 20vw;
  background-size: contain;
  background-repeat: no-repeat;
`;

const DescriptionLabel = styled(Typography)`
  white-space: pre-line;
`;

const MtgCardInfo: FunctionComponent<MtgCardInfoProps> = ({ cardInfo }) => {
  const { name, description, imageUrl } = cardInfo;
  return (
    <Card>
      <Header title={name} />
      <Container maxWidth='xs'>
        <Image image={imageUrl} title={name} />
      </Container>

      <CardContent>
        <DescriptionLabel>{description}</DescriptionLabel>
      </CardContent>
    </Card>
  );
};

export default MtgCardInfo;
