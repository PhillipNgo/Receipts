import type ReceiptItem from "types/Receipt";

import { useMemo } from "react";
import data from "data/data";

export default function useReceiptData(): Array<ReceiptItem> {
  return useMemo(() => {
    const items: Array<ReceiptItem> = [];
    const texts = data.responses[0].fullTextAnnotation.text
      .replaceAll("\n", " ")
      .split(" ");
    let i = 0;
    while (i < texts.length) {
      const nextDollarIndex = texts.findIndex(
        (t, ind) => t.substring(0, 1) === "$" && ind > i
      );
      const relevantText = texts.slice(i, nextDollarIndex + 1);
      i = nextDollarIndex + 1;
      items.push({
        name: relevantText.slice(0, relevantText.length - 1).join(" "),
        cost: relevantText[relevantText.length - 1],
      });
    }
    return items;
  }, [data]);
}
