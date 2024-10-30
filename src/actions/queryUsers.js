"use server";

import prisma from "lib/prisma";

async function queryUsers(query) {
  return await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query.trim().toLowerCase(),
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.trim().toLowerCase(),
            mode: "insensitive",
          },
        },
      ],
    },
  });
}

export default queryUsers;
