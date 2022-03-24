import { sample, combine } from "effector";

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
  transferUserWalletToReceiverWallet,
  transferReceiverWalletToUserWallet,
  // stores
  $reservedShopProducts,
  $shopProducts,
  $userWallet,
  $receiverWallet,
  $receiverWalletTotalMoney,
} from "./model";

sample({
  clock: VendingMachineGate.open,
  target: fetchShopFx,
});

sample({
  clock: addProductReserveClicked,
  source: combine({
    reservedShopProducts: $reservedShopProducts,
    shopProducts: $shopProducts,
  }),
  filter: ({ reservedShopProducts, shopProducts }, productId) => {
    const count = shopProducts[productId] ?? 0;
    const reserved = reservedShopProducts[productId] ?? 0;
    const avalible = count - reserved;
    return avalible > 0;
  },
  fn: (_, productId) => productId,
  target: addProductReserve,
});

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
sample({
  clock: depositMoneyClicked,
  source: $userWallet,
  filter: (userWallet, moneyId) => {
    const avalibleMoney = userWallet[moneyId];
    return avalibleMoney > 0;
  },
  fn: (_, moneyId) => moneyId,
  target: transferUserWalletToReceiverWallet,
});

sample({
  clock: refundClicked,
  source: combine({
    receiverWallet: $receiverWallet,
    receiverWalletTotalMoney: $receiverWalletTotalMoney,
  }),
  filter: ({ receiverWalletTotalMoney }) => {
    return receiverWalletTotalMoney > 0;
  },
  fn: ({ receiverWallet }) => receiverWallet,
  target: transferReceiverWalletToUserWallet,
});
