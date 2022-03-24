import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import styled from "styled-components";

import { Product } from "../../components/Product";
import { combine } from "effector";
import { $catalogue, $userProducts } from "../../models/vendingMachine/model";
import { useStore } from "effector-react";

const $products = combine(
  [$catalogue, $userProducts],
  ([catalogue, userProducts]) => {
    return catalogue.map((product) => {
      const count = userProducts[product.id] ?? 0;

      return { ...product, count };
    });
  }
);

export const UserProducts: React.FC = () => {
  const products = useStore($products);
  return (
    <Container>
      <Title>Продукты пользователя (readonly)</Title>
      <Products>
        {products.map((product) => {
          return (
            <Product key={product.id} disabled={!!product.count}>
              <Label>{product.name}</Label>
              <Label>{product.count} (шт.)</Label>
            </Product>
          );
        })}
      </Products>
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
const Label = styled.span`
  text-align: center;
`;

const Products = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(80px, 1fr));
  grid-template-rows: repeat(3, minmax(80px, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;
