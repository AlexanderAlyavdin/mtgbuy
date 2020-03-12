// TODO: split it ASAP
export default interface CardItem {
  price: number;
  name: string;
  link: string;
  quantity: number;
  condition?: string;
  language: string;
  platform: string;
  platformUrl: string;
  trader?: string;
  traderUrl?: string;
}
