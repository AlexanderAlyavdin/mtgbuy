import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, CardHeader, CardMedia, Container } from '@material-ui/core';
import ICardInfo from 'shared/interfaces/ICardInfo';
import getIconHref from '../utils/icon-mapping';

interface MtgCardInfoProps {
  cardInfo: ICardInfo;
}

const Header = styled(CardHeader)`
  text-align: center;
`;

const Image = styled(CardMedia)`
  height: 30vh;
  background-size: contain;
  background-repeat: no-repeat;
`;

const ManaIcon = styled.img`
  height: 1rem;
  background-size: contain;
  background-repeat: no-repeat;
`;

const DescriptionLabel = styled(Typography)`
  white-space: pre-line;
`;

const MtgCardInfo: FunctionComponent<MtgCardInfoProps> = ({ cardInfo }) => {
  const { name, description, imageUrl } = cardInfo;

  const iconRegexp = /({[^{]*})/;
  const descriptionArray = description.split(iconRegexp).filter(d => d !== '');

  return (
    <Card>
      <Header title={name} />
      <Container maxWidth='xs'>
        <Image image={imageUrl} title={name} />
      </Container>

      <CardContent>
        <DescriptionLabel>
          {descriptionArray.map((desc, index) => {
            if (iconRegexp.test(desc)) {
              const code = desc.replace('{', '').replace('}', '');
              return <ManaIcon key={index} src={getIconHref(code)} />;
            }
            return desc;
          })}
        </DescriptionLabel>
      </CardContent>
    </Card>
  );
};

export default MtgCardInfo;
