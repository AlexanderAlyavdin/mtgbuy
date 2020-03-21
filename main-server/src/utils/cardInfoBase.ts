import { Cards, Card } from 'scryfall-sdk';

import ICardInfo from '@shared/interfaces/ICardInfo';
import Logger, { LogLevel } from './logger';

const logger = new Logger('CardInfo');

const autoCompleteName = async (partName: string): Promise<Array<string>> => {
  return await Cards.autoCompleteName(partName).catch(error => {
    logger.log(`Failed to autocomplete name: ${error}`, LogLevel.Error);
    return [];
  });
};

const getCardInfo = async (cardName: string): Promise<ICardInfo> => {
  return await Cards.byName(cardName, true)
    .then((card: Card) => {
      return {
        name: card.printed_name ? `${card.printed_name} (${card.name})` : card.name,
        imageUrl: card.image_uris && card.image_uris.large,
        description: card.printed_text ? card.printed_text : card.oracle_text,
      };
    })
    .catch(error => {
      logger.log(`Failed to get card info: ${error}`, LogLevel.Error);
      return undefined;
    });
};

export default { autoCompleteName, getCardInfo };
