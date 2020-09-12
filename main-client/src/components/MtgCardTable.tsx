import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import theme from 'theme';

import {
  Link,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import {
  ShoppingCart,
  MonetizationOn,
  Translate,
  StoreOutlined,
  PersonOutline,
  Storage,
  Waves,
} from '@material-ui/icons';
import ICardItem from 'shared/interfaces/ICardItem';
import Condition from 'shared/constants/condition';

const StyledBackdrop = styled(Backdrop)`
  position: relative;
  height: 40vh;
  z-index: ${theme.zIndex.drawer + 100};
  background: none;
`;

interface MtgCardTableProps {
  cardModels?: Array<ICardItem>;
  isLoading: boolean;
}

const MtgCardTable: FunctionComponent<MtgCardTableProps> = ({ cardModels, isLoading }) => {
  return (
    <TableContainer component={Paper}>
      {isLoading && (
        <StyledBackdrop open={isLoading}>
          <CircularProgress />
        </StyledBackdrop>
      )}
      {cardModels && (
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>
                <MonetizationOn />
              </TableCell>
              <TableCell>
                <Storage />
              </TableCell>
              <TableCell>
                <Translate />
              </TableCell>
              <TableCell>
                <Waves />
              </TableCell>
              <TableCell>
                <StoreOutlined />
              </TableCell>
              <TableCell>
                <PersonOutline />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cardModels.map(
              ({ price, quantity, language, condition, platformUrl, platform, trader, traderUrl, link }, index) => {
                let conditionColor;
                switch (condition) {
                  case Condition.Mint:
                    conditionColor = 'cadetblue';
                    break;
                  case Condition.NearMint:
                    conditionColor = 'cornflowerblue';
                    break;
                  case Condition.SlightlyPlayed:
                    conditionColor = 'brown';
                    break;
                  case Condition.HeavilyPlayed:
                    conditionColor = 'red';
                    break;
                  default:
                    conditionColor = 'inherit';
                }
                return (
                  <TableRow key={index}>
                    <TableCell component='th' scope='row'>
                      {price}
                    </TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>{language}</TableCell>
                    <TableCell>
                      <span style={{ color: conditionColor }}>{condition}</span>
                    </TableCell>
                    <TableCell>
                      <Link href={platformUrl}>{platform}</Link>
                    </TableCell>
                    <TableCell>{traderUrl ? <Link href={traderUrl}>{trader}</Link> : trader}</TableCell>
                    <TableCell>
                      <Link href={link}>
                        <ShoppingCart />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default MtgCardTable;
