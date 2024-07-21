import { atom } from "recoil";

export const postOrderState = atom({
    key: 'postOrder', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (aka initial value)
  });