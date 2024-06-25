"use server";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function joinProject(projectId) {
  const session = await getServerSession();
  const project = await prisma.project.findFirstOrThrow({
    where: {
      id: projectId,
    },
    include: {
      users: true,
    },
  });
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      users: {
        set: [...project.users, session.user],
      },
    },
  });
  revalidatePath(projectId);
  return updatedProject;
}

export default joinProject;
