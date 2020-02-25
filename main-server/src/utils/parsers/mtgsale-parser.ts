import { JSDOM } from 'jsdom';

const BASE_URL = 'https://mtgsale.ru';

const getHtmlByCardName = async (cardName: string): Promise<JSDOM> => {
  const response = await fetch(`${BASE_URL}/home/search-results?Name=${cardName}`, {
    mode: 'no-cors',
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: 'mtgsale.ru',
      'Sec-Fetch-Site': 'none',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    },
  });
  const html = await response.text();
  return new JSDOM(html);
};

export default getHtmlByCardName;