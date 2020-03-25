import ICardItem from '@shared/interfaces/ICardItem';

import Logger, { LogLevel } from './utils/logger';
import CardInfoBase from './utils/cardInfoBase';

import MtgSale from './parsers/mtgSaleParser';
import MtgTrade from './parsers/mtgTradeParser';
import CardPlace from './parsers/cardPlaceParser';

const logger = new Logger('SearchAggregator');

const preprocessCardName = async (cardName: string): Promise<string> => {
  cardName = await CardInfoBase.getConvenientName(cardName);
  // Fox multiface cards
  if (cardName) {
    cardName = cardName.replace('//', '');
  }
  return cardName;
};

// Compare by words
const compareCardNames = (leftName: string, rightName: string): boolean => {
  const wordRegex = /[A-Za-z0-9]+/g;
  const leftWords = leftName.match(wordRegex);
  const rightWords = rightName.match(wordRegex);
  return leftWords.length === rightWords.length && leftWords.every((word, index) => word === rightWords[index]);
};

const search = async (cardName: string, filterOnStock: boolean = true): Promise<Array<ICardItem>> => {
  cardName = await preprocessCardName(cardName);
  if (!cardName) {
    logger.log(`No card found by name: ${cardName}`, LogLevel.Warning);
    return [];
  }
  logger.log(`Card name after preprocessing: ${cardName}`);

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

  let cardItems = cardPlaceSearchResult.concat(mtgSaleSearchResult.concat(mtgTradeSearchResult));

  cardItems = cardItems.filter((item: ICardItem) => compareCardNames(item.name, cardName));

  if (filterOnStock) {
    cardItems = cardItems.filter((item: ICardItem) => item.quantity > 0);
  }

  cardItems.sort((first: ICardItem, second: ICardItem): number => first.price - second.price);

  return cardItems;
};

export default { search };
