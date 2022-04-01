import { createEvent, createStore, createEffect, sample, combine, guard, restore } from "effector";
import * as api from "../../api";
import { ICatalogueProduct, Money, MoneyWallet, Products } from "../../types";
import { createGate } from "effector-react";
import { createEmptyWallet } from "../../api/mocks";
import { mergeWallets } from "./utils";

export const VendingMachineGate = createGate("vendingMachine");

//TODO  Навести порядок
export const fetchServerDataTrigger = createEvent();
export const addProductReserveClicked = createEvent<number>();
export const removeProductReserveClicked = createEvent<number>();
export const addProductReserve = createEvent<number>();
export const removeProductReserve = createEvent<number>();

export const depositMoneyClicked = createEvent<string>();
export const withdrawMoneyFromUserWallet = createEvent<string>();
export const depositMoneyToReceiverWallet = createEvent<string>();

export const refundClicked = createEvent();
export const depositMoneyToUserWallet = createEvent<MoneyWallet>();
export const clearReceiverWallet = createEvent();

export const buyClicked = createEvent();
export const depositMoneyToShopWallet = createEvent<MoneyWallet>();
export const calculateChange = createEvent<number>();

const getCatalogueFx = createEffect(api.getCatalogue);
const getUserWalletFx = createEffect(api.getUserWallet);
const getShopWalletFx = createEffect(api.getShopWallet);
const getReceiverWalletFx = createEffect(api.getReceiverWallet);
const getUserProductsFx = createEffect(api.getUserProducts);
const getShopProductsFx = createEffect(api.getShopProducts);

export const fetchShopFx = createEffect(() =>
  Promise.all([getCatalogueFx(), getUserWalletFx(), getShopWalletFx(), getReceiverWalletFx(), getShopProductsFx()])
);

type Errors = "noMoneyInDeposit" | "noProductsInShop"; //todo

const emptyWallet = createEmptyWallet();
export const $error = createStore<Errors | null>(null);
export const $catalogue = createStore<ICatalogueProduct[]>([]);
export const $userWallet = createStore<MoneyWallet>(emptyWallet);
export const $shopWallet = createStore<MoneyWallet>(emptyWallet);
export const $receiverWallet = createStore<MoneyWallet>(emptyWallet);
export const $userProducts = createStore<Products>({});
export const $shopProducts = createStore<Products>({});
export const $reservedShopProducts = createStore<Products>({});

export const $userWalletTotalMoney = $userWallet.map((userWallet) => {
  return Object.entries(userWallet).reduce((result, [moneyId, count]) => {
    return Number(moneyId) * count + result;
  }, 0);
});
export const $totalMoneyInReceiverWallet = $receiverWallet.map((userWallet) => {
  return Object.entries(userWallet).reduce((result, [moneyId, count]) => {
    return Number(moneyId) * count + result;
  }, 0);
});

export const $orderTotalMoney = combine([$catalogue, $reservedShopProducts], ([catalogue, reservedShopProducts]) => {
  const result = Object.entries(reservedShopProducts).reduce((prevValue, [reservedProductId, reservedProductCount]) => {
    const product = catalogue.find((product) => product.id === Number(reservedProductId));
    return prevValue + product.price * reservedProductCount;
  }, 0);
  return result;
});

export const $changeForUser = combine(
  [$orderTotalMoney, $totalMoneyInReceiverWallet],
  ([orderTotalMoney, totalMoneyInReceiverWallet]) => {
    return totalMoneyInReceiverWallet - orderTotalMoney;
  }
);

$catalogue.on(getCatalogueFx.doneData, (_, catalogue) => catalogue);
$userWallet.on(getUserWalletFx.doneData, (_, wallet) => wallet);
$shopWallet.on(getShopWalletFx.doneData, (_, wallet) => wallet);
$receiverWallet.on(getReceiverWalletFx.doneData, (_, wallet) => wallet);
$userProducts.on(getUserProductsFx.doneData, (_, products) => products);
$shopProducts.on(getShopProductsFx.doneData, (_, products) => products);

$reservedShopProducts.on(addProductReserve, (state, productId) => {
  if (state[productId]) {
    return { ...state, [productId]: state[productId] + 1 };
  } else {
    return { ...state, [productId]: 1 };
  }
});
$reservedShopProducts.on(removeProductReserve, (state, productId) => {
  if (state[productId]) {
    return { ...state, [productId]: state[productId] - 1 };
  } else {
    return state;
  }
});

$userWallet.on(withdrawMoneyFromUserWallet, (state, moneyId) => {
  return { ...state, [moneyId]: state[moneyId] - 1 };
});
$receiverWallet.on(depositMoneyToReceiverWallet, (state, moneyId) => {
  return { ...state, [moneyId]: state[moneyId] + 1 };
});
//

$receiverWallet.reset(clearReceiverWallet);

$userWallet.on(depositMoneyToUserWallet, (userWallet, receivedMoney) => {
  return mergeWallets(userWallet, receivedMoney);
});

$shopWallet.on(depositMoneyToShopWallet, (shopWallet, receivedMoney) => {
  return mergeWallets(shopWallet, receivedMoney);
});

// $orderTotalMoney.watch((data) => {
//   console.log("$orderTotalMoney", data);
// });
