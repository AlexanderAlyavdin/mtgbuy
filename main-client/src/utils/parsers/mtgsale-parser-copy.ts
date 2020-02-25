import { JSDOM } from 'jsdom';

const BASE_URL = 'http://localhost:3030/';

const getHtmlByCardName = async (cardName: string): Promise<JSDOM> => {
  const response = await fetch(`${BASE_URL}?cardName=${cardName}`);
  const html = await response.text();
  return new JSDOM(html);
};

export default getHtmlByCardName;
