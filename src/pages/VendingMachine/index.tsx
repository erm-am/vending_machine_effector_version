import React, { useEffect } from "react";

import { UserWallet } from "./UserWallet";
import { ReceiverWallet } from "./ReceiverWallet";
import { ShopProducts } from "./ShopProducts";
import { UserProducts } from "./UserProducts";
import { useGate } from "effector-react";
import { VendingMachineGate } from "../../models/vendingMachine/model";
import styled from "styled-components";

import { useStore } from "effector-react";

import { fetchShopFx } from "../../models/vendingMachine/model";

export const VendingMachine: React.FC = () => {
  useGate(VendingMachineGate);
  const pending = useStore(fetchShopFx.pending);
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
