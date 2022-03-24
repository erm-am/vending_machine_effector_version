import { MoneyWallet } from "../../types";

// {1000:5} + {1000:1} =  {1000:6}
export const mergeWalletsMoney = (
  firstWallet: MoneyWallet,
  secondWallet: MoneyWallet
): MoneyWallet => {
  const result = Object.entries(firstWallet).map(([moneyId, count]) => {
    const firstWalletMoneyCount = count;
    const secondWalletMoneyCount = secondWallet[moneyId];
    const total = firstWalletMoneyCount + secondWalletMoneyCount;
    return [moneyId, total];
  });
  return Object.fromEntries(result);
};
