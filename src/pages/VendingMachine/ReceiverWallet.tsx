import React, { useEffect } from "react";

import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Grid } from "../../components/core/Grid";
import { Row, Cell } from "../../components/core/Grid/Grid.styled";
import { combine } from "effector";
import { useStore } from "effector-react";
import {
  $receiverWallet,
  $shopWallet,
  refundClicked,
  buyClicked,
  $totalMoneyInReceiverWallet,
  $orderTotalMoney,
} from "../../models/vendingMachine/model";

const $wallets = combine([$receiverWallet, $shopWallet], ([receiverWallet, shopWallet]) => {
  return Object.entries(receiverWallet).map(([moneyId, receiverWalletCount]) => {
    const shopWalletCount = shopWallet[moneyId];
    return { moneyId, receiverWalletCount, shopWalletCount };
  });
});

export const ReceiverWallet: React.FC = () => {
  const wallets = useStore($wallets);
  const totalMoneyInReceiverWallet = useStore($totalMoneyInReceiverWallet);
  const orderTotalMoney = useStore($orderTotalMoney);
  const canBuy = totalMoneyInReceiverWallet >= orderTotalMoney && orderTotalMoney > 0 && totalMoneyInReceiverWallet > 0;
  const canRefund = totalMoneyInReceiverWallet > 0;
  const gridColumns = [
    {
      key: "moneyId",
      title: "Наименование",
      renderer: (value) => `${value} руб.`,
    },
    { key: "receiverWalletCount", title: "Монетоприемник (кол-во)" },
    { key: "shopWalletCount", title: "Касса автомата (кол-во)" },
  ];
  const handleClickBuy = () => buyClicked();
  const handleClickRefund = () => refundClicked();

  return (
    <Container>
      <Title>Касса торгового автомата</Title>
      <GridContainer>
        <Grid columns={gridColumns}>
          {wallets.map((wallet) => {
            return (
              <Row key={wallet.moneyId}>
                <Cell>{wallet.moneyId}</Cell>
                <Cell>{wallet.receiverWalletCount}</Cell>
                <Cell>{wallet.shopWalletCount}</Cell>
              </Row>
            );
          })}
        </Grid>
      </GridContainer>
      <Total>
        Сумма к оплате:&nbsp;<b>{orderTotalMoney} руб.</b>
      </Total>
      <Total>
        Сумма в монетоприемнике:&nbsp;<b>{totalMoneyInReceiverWallet} руб.</b>{" "}
      </Total>
      <Action disabled={!canRefund} onClick={handleClickRefund}>
        Забрать деньги
      </Action>
      <Action disabled={!canBuy} onClick={handleClickBuy}>
        Купить
      </Action>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
`;
const Title = styled.h4`
  padding: 5px;
`;
const Wallet = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid red;
  padding: 10px;
`;

const Total = styled.div`
  display: flex;
  padding: 5px;
`;
const GridContainer = styled.div`
  display: flex;
  padding: 10px;
  overflow: auto;
  width: 100%;
`;
const Action = styled(Button)`
  padding: 5px;
`;
