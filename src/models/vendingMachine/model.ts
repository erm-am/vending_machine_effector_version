import {
  createEvent,
  createStore,
  createEffect,
  sample,
  combine,
  guard,
  restore,
} from "effector";
import * as api from "../../api";
import { ICatalogueProduct, Money, MoneyWallet, Products } from "../../types";
import { createGate } from "effector-react";
import { createEmptyWallet } from "../../api/mocks";
import { mergeWalletsMoney } from "./utils";

export const VendingMachineGate = createGate("vendingMachine");

//TODO  Навести порядок
export const fetchServerDataTrigger = createEvent();
export const addProductReserveClicked = createEvent<number>();
export const removeProductReserveClicked = createEvent<number>();
export const addProductReserve = createEvent<number>();
export const removeProductReserve = createEvent<number>();

export const depositMoneyClicked = createEvent<string>();
export const transferUserWalletToReceiverWallet = createEvent<string>();
export const refundClicked = createEvent();
export const transferReceiverWalletToUserWallet = createEvent<MoneyWallet>();

export const buyClicked = createEvent();

const getCatalogueFx = createEffect(api.getCatalogue);
const getUserWalletFx = createEffect(api.getUserWallet);
const getShopWalletFx = createEffect(api.getShopWallet);
const getReceiverWalletFx = createEffect(api.getReceiverWallet);
const getUserProductsFx = createEffect(api.getUserProducts);
const getShopProductsFx = createEffect(api.getShopProducts);

export const fetchShopFx = createEffect(() =>
  Promise.all([
    getCatalogueFx(),
    getUserWalletFx(),
    getShopWalletFx(),
    getReceiverWalletFx(),
    getShopProductsFx(),
  ])
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
export const $receiverWalletTotalMoney = $receiverWallet.map((userWallet) => {
  return Object.entries(userWallet).reduce((result, [moneyId, count]) => {
    return Number(moneyId) * count + result;
  }, 0);
});

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

// Перевод из кошелька юзера в монетоприемник
$userWallet.on(transferUserWalletToReceiverWallet, (state, moneyId) => {
  return { ...state, [moneyId]: state[moneyId] - 1 };
});
$receiverWallet.on(transferUserWalletToReceiverWallet, (state, moneyId) => {
  return { ...state, [moneyId]: state[moneyId] + 1 };
});
//

// Перевод всех денег из монетоприемника в кошелек пользователя
$receiverWallet.on(transferReceiverWalletToUserWallet, () => {
  return createEmptyWallet();
});

$userWallet.on(
  transferReceiverWalletToUserWallet,
  (userWallet, receiverWallet) => {
    return mergeWalletsMoney(userWallet, receiverWallet);
  }
);
