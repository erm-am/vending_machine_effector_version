import React, { useEffect } from "react";
import { combine } from "effector";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Product } from "../../components/Product";
import { useStore } from "effector-react";

import {
  $shopProducts,
  $catalogue,
  $reservedShopProducts,
  removeProductReserveClicked,
  addProductReserveClicked,
} from "../../models/vendingMachine/model";

const $products = combine(
  [$catalogue, $shopProducts, $reservedShopProducts],
  ([catalogue, shopProducts, reservedShopProducts]) => {
    return catalogue.map((product) => {
      const count = shopProducts[product.id] ?? 0;
      const reserved = reservedShopProducts[product.id] ?? 0;
      return { ...product, count, reserved };
    });
  }
);

export const ShopProducts: React.FC = () => {
  const products = useStore($products);

  return (
    <Container>
      <Title>Продукты торгового автомата</Title>
      <Products>
        {products.map((product) => {
          return (
            <Product key={product.id} disabled={!product.count}>
              <Label>{product.name}</Label>
              <Label>
                <Button onClick={() => removeProductReserveClicked(product.id)} disabled={!product.count}>
                  -
                </Button>
                {product.reserved}\{product.count}
                <Button onClick={() => addProductReserveClicked(product.id)} disabled={!product.count}>
                  +
                </Button>
              </Label>
              <Label>Цена: {product.price}</Label>
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
  padding: 5px;
`;
const Products = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(134px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(134px, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;
