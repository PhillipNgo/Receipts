import ProjectContext from "contexts/ProjectContext";
import { useMemo } from "react";

type UserTotal = {
  email: string,
  total: Number,
};

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

function splitReceipt(receipt, projectUsers): UserTotal {
  const users =
    receipt.users == null || receipt.users.length === 0
      ? projectUsers
      : receipt.users;
  const value = receipt.total / users.length;
  return users.map((user) => ({
    email: user.email,
    total: value,
  }));
}

function itemizeReceipt(receipt, projectUsers): Array<UserTotal> {
  const subTotal = receipt.receipt_items.reduce(
    (a, b) => a + Number(b.total ?? 0),
    0
  );
  const multiplier = (receipt.total - subTotal) / subTotal + 1;
  return receipt.receipt_items
    .map((receiptItem) => ({
      ...receiptItem,
      total: receiptItem.total * multiplier,
    }))
    .map((receiptItem) => splitReceipt(receiptItem, projectUsers));
}

function proportionReceipt(receipt): Array<UserTotal> {
  const userProportions = receipt.user_proportions ?? [];
  const totalWeight = userProportions.reduce((a, b) => a + b.weight, 0);
  return userProportions.map((userWeight) => ({
    email: userWeight.user_id,
    total: (userWeight.weight / totalWeight) * receipt.total,
  }));
}

export default function ProjectContextProvider({ children, project }) {
  const userTotals = useMemo(() => {
    const totals = project.users.map((user) => ({
      email: user.email,
      total: 0,
    }));
    const receiptUserTotals = project.receipts
      .map((receipt) => {
        switch (receipt.split_type) {
          case "SPLIT":
            return splitReceipt(receipt, project.users);
          case "ITEMIZED":
            return itemizeReceipt(receipt, project.users);
          case "PROPORTIONAL":
            return proportionReceipt(receipt);
        }
      })
      .flat(2);
    receiptUserTotals.forEach((receiptUserTotal) => {
      const userTotal = totals.find(
        (total) => total.email === receiptUserTotal.email
      );
      userTotal.total = userTotal.total + receiptUserTotal.total;
    });
    return totals.map((userTotal) => ({
      ...userTotal,
      total: roundNumber(userTotal.total),
    }));
  }, [project]);
  return (
    <ProjectContext.Provider value={{ project, userTotals }}>
      {children}
    </ProjectContext.Provider>
  );
}
