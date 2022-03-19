import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { UserWallet } from "./UserWallet";
import { ReceiverWallet } from "./ReceiverWallet";
import { ShopProducts } from "./ShopProducts";
import { UserProducts } from "./UserProducts";
import { createGate, useGate } from "effector-react";

import styled from "styled-components";
export const VendingMachineGate = createGate("vendingMachine");
export const VendingMachine: React.FC = (props) => {
  useGate(VendingMachineGate, props);

  return (
    <Shop>
      <VendingSection>
        <Limiter direction="row">
          <ShopProducts />
          <ReceiverWallet />
        </Limiter>
      </VendingSection>

      <UserSection>
        <Limiter direction="row">
          <UserProducts />
          <UserWallet />
        </Limiter>
      </UserSection>
    </Shop>
  );
};

const Shop = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  min-height: 100vh;
`;

const VendingSection = styled.div`
  display: flex;
  flex: 1;
  background-color: #20212e;
  justify-content: center;
  padding: 20px;
`;

const UserSection = styled.div`
  display: flex;
  flex: 1;
  background-color: #191923;
  justify-content: center;
  padding: 20px;
`;

const Limiter = styled.div<{ direction: "row" | "column" }>`
  display: flex;
  max-width: 1100px;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: ${(p) => p.direction};
  width: 100%;
  height: 100%;
`;
