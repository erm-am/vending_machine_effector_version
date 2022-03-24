import { Money, MoneyWallet } from "../types";

export const moneyList: Money[] = [
  "1",
  "2",
  "5",
  "10",
  "50",
  "100",
  "200",
  "500",
  "1000",
];
function createWallet(moneyList: Money[], defaultCount: number = 0) {
  return moneyList.reduce(
    (result, current) => ({ ...result, [current]: defaultCount }),
    {}
  ) as MoneyWallet;
}

// Каталог продуктов (справочник)
export const catalogue = [
  { id: 1, name: "Эспрессо", price: 10 },
  { id: 2, name: "Капучино", price: 15 },
  { id: 3, name: "Латте", price: 15 },
  { id: 4, name: "Черный чай", price: 14 },
  { id: 5, name: "Зеленый чай", price: 14 },
  { id: 6, name: "Coca-cola", price: 33 },
  { id: 7, name: "Fanta", price: 34 },
  { id: 8, name: "Pepsi", price: 35 },
  { id: 9, name: "Sprite", price: 36 },
];

// Продукты магазина (id, кол-во)
export const shopProducts = {
  1: 10,
  2: 10,
  3: 10,
  4: 10,
  5: 10,
  6: 10,
  7: 10,
  8: 10,
  9: 10,
};

// Продукты пользователя (id, кол-во)
export const userProducts = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};

export const userWallet = createWallet(moneyList, 5);
export const shopWallet = createWallet(moneyList, 50);
export const receiverWallet = createWallet(moneyList, 0);
export const createEmptyWallet = () => createWallet(moneyList, 0);
