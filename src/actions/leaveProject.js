"use server";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function leaveProject(projectId) {
  const session = await getServerSession();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user.email,
    },
    include: {
      projects: true,
    },
  });
  const updatedUser = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      projects: {
        set: user.projects.filter((project) => project.id !== projectId),
      },
    },
  });
  revalidatePath("/");
  return updatedUser;
}

export default leaveProject;
