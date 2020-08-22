import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import ICardPreview from '@shared/interfaces/ICardPreview';

import ICardShop from './interfaces/ICardShop';

import Logger, { LogLevel } from './utils/logger';
import CardInfoBase from './utils/cardInfoBase';

import MtgSale from './shops/mtgSale';
import MtgTrade from './shops/mtgTrade';
import CardPlace from './shops/cardPlace';

const logger = new Logger('SearchAggregator');

const shopList: Array<ICardShop> = [MtgSale, MtgTrade, CardPlace];

const preprocessCardName = async (cardName: string): Promise<string> => {
  cardName = await CardInfoBase.getConvenientName(cardName);
  // Fix multiface cards
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

  const runSearch = async (shop: ICardShop): Promise<Array<ICardItem>> => {
    try {
      return shop.searchCard(cardName);
    } catch (error) {
      logger.log(`Failed to get results from ${shop.shopName}: ${error}`, LogLevel.Error);
      return [];
    }
  };

  const searchPromises = shopList.map((shop: ICardShop) => runSearch(shop));

  logger.log(`Searching on ${shopList.map((shop: ICardShop) => shop.shopName).join(' | ')}`);

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
  logger.log(`Start bulk search for: ${cardNames}`);

  const preprocessedCardNames = await Promise.all(cardNames.map(name => preprocessCardName(name)));
  logger.log(`Preprocessed card names: ${preprocessedCardNames}`);

  const runSearch = async (shop: ICardShop): Promise<Array<ISearchResult>> => {
    try {
      return shop.searchCardList(preprocessedCardNames);
    } catch (error) {
      logger.log(`Failed to get results from ${shop.shopName}: ${error}`, LogLevel.Error);
      return [];
    }
  };

  const searchPromises = shopList.map((shop: ICardShop) => runSearch(shop));

  logger.log(`Searching card list on ${shopList.map((shop: ICardShop) => shop.shopName).join(' | ')}`);

  let searchResults = [];
  await Promise.all(searchPromises)
    .then(results => results.flat())
    .then(results => {
      results.forEach((value: ISearchResult) => {
        const existing = searchResults.filter(e => e.cardName == value.cardName);
        if (existing.length > 0) {
          existing[0].searchResult.push(...value.searchResult);
        } else {
          searchResults.push(value);
        }
      });
    })
    .catch(error => {
      logger.log(`Error while aggregating bulk search results: ${error}`, LogLevel.Error);
      return [];
    });

  //TODO: add filters and sort

  return searchResults;
};

const explore = async (url: string, pageNum: Number): Promise<Array<ICardPreview>> => {
  const urlObj = new URL(url);
  const found = shopList.find(shop => (new URL(shop.hostUrl).hostname == urlObj.hostname));
  if (!found) {
    logger.log(`No shop found to explore url: ${url}`, LogLevel.Error);
    return [];
  }

  if (!found.explore) {
    logger.log(`Target shop does not support explore yet: ${found.shopName}`, LogLevel.Error);
    return [];
  }

  return await found.explore(url, pageNum);
};

export default { search, bulkSearch, explore };
