import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';

import ICardShop from './interfaces/ICardShop';

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
  if (!leftWords || !rightWords) {
    logger.log(`Failed names comparison: ${leftName} ${rightName}`, LogLevel.Warning);
    return false;
  }
  return leftWords.length === rightWords.length && leftWords.every((word, index) => word === rightWords[index]);
};

const search = async (cardName: string, filterOnStock: boolean = true): Promise<Array<ICardItem>> => {
  cardName = await preprocessCardName(cardName);
  if (!cardName) {
    logger.log(`No card found by name: ${cardName}`, LogLevel.Warning);
    return [];
  }
  logger.log(`Card name after preprocessing: ${cardName}`);

  const runSearch = (shop: ICardShop): Promise<Array<ICardItem>> => {
    return shop
      .searchCard(cardName)
      .then(result => shop.parseSearchResult(result))
      .catch(error => {
        logger.log(`Failed to get results from ${shop.shopName}: ${error}`, LogLevel.Error);
        return [];
      });
  };

  const searchPromises = [runSearch(MtgSale), runSearch(MtgTrade), runSearch(CardPlace)];

  logger.log('Searching on mtgsale | mtgtrade | cardplace');

  let cardItems = await Promise.all(searchPromises)
    .then(result => result.flat())
    .catch(error => {
      logger.log(`Error while aggregating search results: ${error}`, LogLevel.Error);
      return [];
    });

  cardItems = cardItems.filter((item: ICardItem) => compareCardNames(item.name, cardName));

  if (filterOnStock) {
    cardItems = cardItems.filter((item: ICardItem) => item.quantity > 0);
  }

  cardItems.sort((first: ICardItem, second: ICardItem): number => first.price - second.price);

  return cardItems;
};

const bulkSearch = async (cardNames: Array<string>): Promise<Array<ISearchResult>> => {
  const searchPromises = cardNames.map(
    async (cardName: string): Promise<ISearchResult> => {
      const preprocessedCardName = await preprocessCardName(cardName);
      if (!preprocessedCardName) {
        return { cardName, searchResult: [], error: 'Invalid name' };
      }
      return await search(preprocessedCardName)
        .then((result: Array<ICardItem>) => ({ cardName: preprocessedCardName, searchResult: result }))
        .catch(error => {
          logger.log(`Error bulk search for card ${preprocessedCardName}: ${error}`);
          return { cardName: preprocessedCardName, searchResult: [], error: 'Search failed' };
        });
    },
  );

  return await Promise.all(searchPromises).catch(error => {
    logger.log(`Error while aggregating bulk search results: ${error}`, LogLevel.Error);
    return [];
  });
};

export default { search, bulkSearch };
