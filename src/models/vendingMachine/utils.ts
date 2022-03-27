import { MoneyWallet } from "../../types";

// Сложить деньги в 2 кошельках и получить 1 кошелек
// {1000:5} + {1000:1} =  {1000:6}
export const mergeWallets = (firstWallet: MoneyWallet, secondWallet: MoneyWallet): MoneyWallet => {
  const result = Object.entries(firstWallet).map(([moneyId, count]) => {
    const firstWalletMoneyCount = count;
    const secondWalletMoneyCount = secondWallet[moneyId];
    const total = firstWalletMoneyCount + secondWalletMoneyCount;
    return [moneyId, total];
  });
  return Object.fromEntries(result);
};

export const calculateChange = () => {};
