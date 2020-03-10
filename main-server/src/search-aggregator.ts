import ICardItem from '@shared/interfaces/ICardItem';

import Logger, { LogLevel } from './utils/logger';

import MtgSale from './parsers/mtgSaleParser';
import MtgTrade from './parsers/mtgTradeParser';
import CardPlace from './parsers/cardPlaceParser';

const logger = new Logger('SearchAggregator');

const search = async (cardName: string): Promise<Array<ICardItem>> => {
  const mtgSaleSearchPromise = MtgSale.searchCard(cardName).then(result => MtgSale.parseSearchResult(result));
  const mtgTradeSearchPromise = MtgTrade.searchCard(cardName).then(result => MtgTrade.parseSearchResult(result));
  const cardPlaceSearchPromise = CardPlace.searchCard(cardName).then(result => CardPlace.parseSearchResult(result));
  logger.log('Searching on mtgsale | mtgtrade | cardplace');

  const mtgSaleSearchResult = await mtgSaleSearchPromise.catch(error => {
    logger.log(`Failed to get results from mtgsale: ${error}`, LogLevel.Error);
    return [];
  });

  const mtgTradeSearchResult = await mtgTradeSearchPromise.catch(error => {
    logger.log(`Failed to get results from mtgtrade: ${error}`, LogLevel.Error);
    return [];
  });

  const cardPlaceSearchResult = await cardPlaceSearchPromise.catch(error => {
    logger.log(`Failed to get results from cardplace: ${error}`, LogLevel.Error);
    return [];
  });

  return cardPlaceSearchResult.concat(mtgSaleSearchResult.concat(mtgTradeSearchResult));
};

export default { search };
