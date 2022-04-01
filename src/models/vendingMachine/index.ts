import { shopProducts } from "./../../api/mocks";
import { sample, combine, createEvent } from "effector";

import {
  // effects
  fetchShopFx,
  // gates
  VendingMachineGate,
  // events (from ui)
  addProductReserveClicked,
  removeProductReserveClicked,
  refundClicked,
  buyClicked,
  // events
  removeProductReserve,
  addProductReserve,
  depositMoneyClicked,
  withdrawMoneyFromUserWallet,
  depositMoneyToReceiverWallet,
  clearReceiverWallet,
  depositMoneyToUserWallet,
  depositMoneyToShopWallet,
  calculateChange,
  // stores
  $reservedShopProducts,
  $shopProducts,
  $userProducts,
  $userWallet,
  $shopWallet,
  $receiverWallet,
  $totalMoneyInReceiverWallet,
  $changeForUser,
  $orderTotalMoney,
} from "./model";

sample({
  clock: VendingMachineGate.open,
  target: fetchShopFx,
});

// Добавить продукт в резерв
sample({
  clock: addProductReserveClicked,
  source: combine({
    reservedShopProducts: $reservedShopProducts,
    shopProducts: $shopProducts,
  }),
  filter: ({ reservedShopProducts, shopProducts }, productId) => {
    const count = shopProducts[productId] ?? 0;
    const reserved = reservedShopProducts[productId] ?? 0;
    const available = count - reserved;
    return available > 0;
  },
  fn: (_, productId) => productId,
  target: addProductReserve,
});

// Убрать продукт из резерва
sample({
  clock: removeProductReserveClicked,
  source: $reservedShopProducts,
  filter: (reservedShopProducts, productId) => {
    const reserved = reservedShopProducts[productId] ?? 0;
    const hasReserved = reserved > 0;
    return hasReserved;
  },
  fn: (_, productId) => productId,
  target: removeProductReserve,
});

// Внести купюру в монетоприемник
sample({
  clock: depositMoneyClicked,
  source: $userWallet,
  filter: (userWallet, moneyId) => {
    const availableMoney = userWallet[moneyId];
    return availableMoney > 0;
  },
  fn: (_, moneyId) => moneyId,
  target: [withdrawMoneyFromUserWallet, depositMoneyToReceiverWallet],
});

// Возврат денег
sample({
  clock: refundClicked,
  source: combine({
    receiverWallet: $receiverWallet,
    totalMoneyInReceiverWallet: $totalMoneyInReceiverWallet,
  }),
  filter: ({ totalMoneyInReceiverWallet }) => {
    return totalMoneyInReceiverWallet > 0;
  },
  fn: ({ receiverWallet }) => receiverWallet,
  target: [clearReceiverWallet, depositMoneyToUserWallet],
});

// sample({
//   clock: buyClicked,
//   source: combine({
//     changeForUser: $changeForUser,
//     totalMoneyInReceiverWallet: $totalMoneyInReceiverWallet,
//     orderTotalMoney: $orderTotalMoney,
//     receiverWallet: $receiverWallet,
//   }),
//   filter: ({ totalMoneyInReceiverWallet, orderTotalMoney }) => {
//     return totalMoneyInReceiverWallet >= orderTotalMoney && orderTotalMoney > 0 && totalMoneyInReceiverWallet > 0;
//   },
//   fn: ({ receiverWallet }) => {
//     return receiverWallet;
//   },
//   target: [clearReceiverWallet, depositMoneyToShopWallet, calculateChange],
// });

// TODO нужно разбить на 3 "действия"

// 1) Переложить деньги из монетоприемника в кассу машины
// 2) Переместить товары потребителю
// 3) Вернуть сдачу

// Пример реализации
// Sample Переложить деньги
const depositedMoney = createEvent(); // чисто для логики
sample({ clock: buyClicked, target: depositedMoney });

//
// Sample Переместить товары потребителю
const productsReleased = createEvent(); //
sample({ clock: depositedMoney, target: productsReleased });

// Sample Вернуть сдачу
sample({ clock: productsReleased });
