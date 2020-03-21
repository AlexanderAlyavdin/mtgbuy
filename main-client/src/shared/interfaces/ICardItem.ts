import Condition from '../constants/condition';

// TODO: split it ASAP
export default interface CardItem {
  price: number;
  name: string;
  link: string;
  quantity: number;
  condition?: Condition;
  language: string;
  platform: string;
  platformUrl: string;
  trader?: string;
  traderUrl?: string;
}
