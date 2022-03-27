import React from "react";
import { useStore } from "effector-react";
import styled, { css } from "styled-components";
import { $userWallet, $userWalletTotalMoney, depositMoneyClicked } from "../../models/vendingMachine/model";

export const UserWallet: React.FC = () => {
  const userWallet = useStore($userWallet);
  const userWalletTotalMoney = useStore($userWalletTotalMoney);
  const convertedUserWallet = Object.entries(userWallet);

  return (
    <Container>
      <Title>Деньги пользователя</Title>
      <Wallet>
        {convertedUserWallet.map(([moneyId, count]) => {
          return (
            <Money disabled={!count} key={moneyId} onClick={() => depositMoneyClicked(moneyId)}>
              <MoneyCaption>{moneyId} руб</MoneyCaption>
              <MoneyQuantity title="Количество">{count}</MoneyQuantity>
            </Money>
          );
        })}
      </Wallet>
      <Amount>
        Сумма:&nbsp;<b>{userWalletTotalMoney} руб.</b>
      </Amount>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;
const Title = styled.h4`
  padding: 5px;
`;
const Wallet = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(80px, 1fr));
  grid-template-rows: repeat(3, minmax(80px, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;

const Money = styled.div<{ disabled: boolean }>`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  position: relative;
  background: #242532;
  &:hover {
    background: #ffcc00;
    color: black;
  }
  ${(props) =>
    props.disabled &&
    css`
      background: #8080800f;
      color: gray;
      cursor: default;
      user-select: none;
      &:hover {
        background: #8080800f;
        color: gray;
      }
    `}
`;
const MoneyCaption = styled.span`
  display: flex;
`;
const MoneyQuantity = styled.div`
  display: flex;
  position: absolute;
  right: 2px;
  top: 2px;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid gray;
  padding: 2px;
`;

const Amount = styled.div`
  display: flex;
  padding-left: 10px;
  padding-bottom: 15px;
`;
