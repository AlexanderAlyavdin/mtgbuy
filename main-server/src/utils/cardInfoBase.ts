import { Cards, Card, CardFace } from 'scryfall-sdk';

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
      let descriptions = [];
      if (card.card_faces) {
        card.card_faces.forEach((face: CardFace) => {
          descriptions.push(face.printed_name ? `${face.printed_name} (${face.name})` : face.name);
          descriptions.push(face.printed_text ? face.printed_text : face.oracle_text);
        });
      } else {
        descriptions.push(card.printed_text ? card.printed_text : card.oracle_text);
      }
      return {
        name: card.printed_name ? `${card.printed_name} (${card.name})` : card.name,
        imageUrl: card.image_uris && card.image_uris.large,
        description: descriptions.join('\n'),
      };
    })
    .catch(error => {
      logger.log(`Failed to get card info: ${error}`, LogLevel.Error);
      return undefined;
    });
};

const getConvenientName = async (cardName: string): Promise<string> => {
  return await Cards.byName(cardName, true)
    .then((card: Card) => card.name)
    .catch(error => {
      logger.log(`Failed to get card name: ${error}`, LogLevel.Error);
      return undefined;
    });
};

export default { autoCompleteName, getCardInfo, getConvenientName };
