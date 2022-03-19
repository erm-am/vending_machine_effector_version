import { createEvent, createStore, createEffect, sample, combine, guard, restore } from "effector";
import { fetchServerDataTrigger } from "./model";
import { VendingMachineGate } from "../../pages/VendingMachine";

sample({
  clock: VendingMachineGate.open,
  target: fetchServerDataTrigger,
});
