"use server";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";

async function createUser(formData) {
  const session = await getServerSession();
  const sessionEmail = session.user.email;
  if (sessionEmail == null || sessionEmail !== process.env.ADMIN_EMAIL) {
    return null;
  }
  const email = formData.get("email");
  const name = formData.get("name");
  if (email == null || email.length < 5 || name == null) {
    throw new Error("Invalid data provided");
  }
  return await prisma.user.create({
    data: {
      email,
      name,
    },
  });
}

export default createUser;
