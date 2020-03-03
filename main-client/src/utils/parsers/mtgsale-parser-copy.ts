const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3030/' : 'https://mtgbuy.herokuapp.com/';

const getHtmlByCardName = async (cardName: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}search?cardName=${cardName}`);
  return response.json();
};

export default getHtmlByCardName;
