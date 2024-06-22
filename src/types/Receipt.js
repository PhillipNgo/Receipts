import type SplitType from "types/SplitType";
import type Participant from "types/Participant";

export type ReceiptItem = {
  name: string,
  splitType?: SplitType,
  cost: number,
  participants?: Array<Participant>,
};

export type Receipt = {
  ...ReceiptItem,
  items?: Array<ReceiptItem>,
};
