"use server";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function deleteReceipt(receiptID, projectID) {
  const deleteReceiptItems = await prisma.receiptItem.deleteMany({
    where: {
      receipt_id: receiptID,
    },
  });

  const deleteUserWeights = await prisma.userWeight.deleteMany({
    where: {
      receipt_id: receiptID,
    },
  });

  const receipt = await prisma.receipt.delete({
    where: {
      id: receiptID,
    },
  });
  revalidatePath("/" + projectID);
  return JSON.stringify(receipt);
}

export default deleteReceipt;
