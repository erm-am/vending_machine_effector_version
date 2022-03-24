export type Money =
  | "1"
  | "2"
  | "5"
  | "10"
  | "50"
  | "100"
  | "200"
  | "500"
  | "1000";
export type MoneyWallet = Record<Money, number>;
export type Products = Record<number, number>;

export interface ICatalogueProduct {
  id: number;
  name: string;
  price: number;
}
