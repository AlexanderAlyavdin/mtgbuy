import { Cards } from 'scryfall-sdk';
import Logger from './logger';

const logger = new Logger('CardInfo');

const autoCompleteName = async (partName: string): Promise<Array<string>> => {
  return await Cards.autoCompleteName(partName).catch(error => {
    logger.log(`Failed to autocomplete name: ${error}`);
    return [];
  });
};

export default { autoCompleteName };
