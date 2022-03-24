import { Money, ICatalogueProduct, MoneyWallet, Products } from "../types";

import { axiosInstance as api } from "./axios";

export const getCatalogue = () =>
  api.get<void, ICatalogueProduct[]>(`/catalogue`);
export const getUserWallet = () => api.get<void, MoneyWallet>(`/userWallet`);
export const getShopWallet = () => api.get<void, MoneyWallet>(`/shopWallet`);
export const getReceiverWallet = () =>
  api.get<void, MoneyWallet>(`/receiverWallet`);
export const getUserProducts = () => api.get<void, Products>(`/userProducts`);
export const getShopProducts = () => api.get<void, Products>(`/shopProducts`);
