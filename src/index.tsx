import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

import { GlobalStyles } from "./global-styles";
import { initApiWorker } from "./api/server";
import "./models/init"; // effector

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  initApiWorker(); // fake api worker server
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
