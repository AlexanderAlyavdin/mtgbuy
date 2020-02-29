import { JSDOM } from 'jsdom';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3030/' : 'https://mtgbuy.herokuapp.com/';

const getHtmlByCardName = async (cardName: string): Promise<JSDOM> => {
  const response = await fetch(`${BASE_URL}search?cardName=${cardName}`);
  const html = await response.text();
  return new JSDOM(html);
};

export default getHtmlByCardName;
