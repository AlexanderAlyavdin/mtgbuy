import ICardItem from '../../shared/interfaces/ICardItem';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3030/' : 'https://mtgbuy.herokuapp.com/';

const searchCards = async (cardName: string): Promise<Array<ICardItem>> => {
  const response = await fetch(`${BASE_URL}search?cardName=${cardName}`);
  return response.json();
};

const getSuggestions = async (partName: string): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}suggestions?partName=${partName}`);
  return response.json();
};

export default { searchCards, getSuggestions };
