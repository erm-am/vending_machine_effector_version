import { createEvent, createStore, createEffect, sample, combine, guard, restore } from "effector";
import * as api from "../../api";

export const fetchServerDataTrigger = createEvent();

const addReserveProduct = createEvent();
const removeReserveProduct = createEvent();

const getCatalogueFx = createEffect(async () => await api.getCatalogue());
const getUserWalletFx = createEffect(async () => await api.getUserWallet());
const getShopWalletFx = createEffect(async () => await api.getShopWallet());
const getReceiverWalletFx = createEffect(async () => await api.getReceiverWallet());
const getUserProductsFx = createEffect(async () => await api.getUserProducts());
const getShopProductsFx = createEffect(async () => await api.getShopProducts());

export const $catalogue = createStore([]).on(getCatalogueFx.doneData, (_, catalogue) => catalogue);
export const $userWallet = createStore(new Map()).on(getUserWalletFx.doneData, (_, wallet) => new Map(wallet));
export const $shopWallet = createStore(new Map()).on(getShopWalletFx.doneData, (_, wallet) => new Map(wallet));
export const $receiverWallet = createStore(new Map()).on(getReceiverWalletFx.doneData, (_, wallet) => new Map(wallet));
export const $userProducts = createStore(new Map()).on(getUserProductsFx.doneData, (_, products) => products);
export const $shopProducts = createStore(new Map()).on(getShopProductsFx.doneData, (_, products) => products);

export const $reservedShopProducts = createStore(new Map())
  .on(addReserveProduct, (reservedProducts, productId) => {
    const newReservedProducts = new Map(reservedProducts.entries());
    const currentCount = newReservedProducts.get(productId) ?? 0;
    newReservedProducts.set(productId, currentCount + 1);
    return newReservedProducts;
  })
  .on(removeReserveProduct, (reservedProducts, productId) => {
    const newReservedProducts = new Map(reservedProducts.entries());
    const currentCount = newReservedProducts.get(productId) ?? 0;
    newReservedProducts.set(productId, currentCount - 1);
    return newReservedProducts;
  });

export const $mappedShopProducts = combine(
  [$catalogue, $shopProducts, $reservedShopProducts],
  ([catalogue, shopProducts, reservedShopProducts]) => {
    return catalogue.map((product) => ({ ...product, qwe: 1 }));
  }
);

$catalogue.watch((data) => {
  console.log(data);
});
$userWallet.watch((data) => {
  console.log(data);
});
$shopWallet.watch((data) => {
  console.log(data);
});
$receiverWallet.watch((data) => {
  console.log(data);
});
$userProducts.watch((data) => {
  console.log(data);
});
$shopProducts.watch((data) => {
  console.log(data);
});
