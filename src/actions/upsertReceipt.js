"use server";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

async function upsertReceipt(receiptID, projectID, formData, otherData) {
  const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
  });
  const imageFile: File = otherData.get("image");
  let imageID;
  if (imageFile != null && imageFile.size !== 0) {
    const imageBody = await imageFile.arrayBuffer();
    imageID = `${crypto.randomUUID()}.${imageFile.type.split("/")[1]}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_IMAGE_BUCKET,
        Key: imageID,
        Body: imageBody,
      })
    );
  }
  const newReceipt = await prisma.receipt.upsert({
    where: {
      id: receiptID || "",
    },
    update: {
      split_type: formData.splitType,
      name: formData.name,
      total: String(formData.total),
      user_proportions: {
        deleteMany: {},
        createMany: {
          data: formData.userProportions.map((userProportion) => ({
            user_id: userProportion.user_id,
            weight: userProportion.weight,
          })),
        },
      },
      receipt_items: {
        deleteMany: {},
      },
      users: {
        set: formData.users.map((user) => ({ email: user })),
      },
      payer: {
        connect: { email: formData.payer },
      },
      image_id: imageID,
    },
    create: {
      split_type: formData.splitType,
      name: formData.name,
      total: String(formData.total),
      project: {
        connect: {
          id: projectID,
        },
      },
      user_proportions: {
        createMany: {
          data: formData.userProportions.map((userProportion) => ({
            user_id: userProportion.user_id,
            weight: userProportion.weight,
          })),
        },
      },

      users: {
        connect: formData.users.map((user) => ({ email: user })),
      },
      payer: {
        connect: { email: formData.payer },
      },
      image_id: imageID,
    },
  });

  const newReceiptItems = await Promise.all(
    formData.receiptItems.map(
      async (receiptItem) =>
        await prisma.receiptItem.create({
          data: {
            name: receiptItem.name,
            total: String(receiptItem.total),
            users: {
              connect: receiptItem.users.map((user) => ({
                email: user,
              })),
            },
            receipt: {
              connect: {
                id: newReceipt.id,
              },
            },
            split_type: "SPLIT",
          },
        })
    )
  );

  const receipt = await prisma.receipt.findUnique({
    where: {
      id: newReceipt.id,
    },
  });

  revalidatePath("/" + projectID);

  return JSON.stringify(receipt);
}

export default upsertReceipt;
