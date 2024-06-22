import type SplitType from "types/SplitType";
import type User from "types/User";

export type ReceiptItem = {
  name: string,
  splitType?: SplitType,
  cost: number,
  users?: Array<User>,
};

export type Receipt = {
  ...ReceiptItem,
  items?: Array<ReceiptItem>,
};
