"use server";

import prisma from "lib/prisma";
import { redirect } from "next/navigation";

async function createProject(formData) {
  const projectName = formData.get("projectName");
  const projectCode = formData.get("projectCode");
  const users = formData.get("users").split(",");

  if (
    projectName == null ||
    projectName.length < 5 ||
    projectCode == null ||
    projectCode.length < 5 ||
    users.length === 0
  ) {
    throw new Error("Invalid data provided");
  }

  const project = await prisma.project.create({
    data: {
      id: formData.get("projectCode"),
      name: formData.get("projectName"),
      users: {
        connect: formData
          .get("users")
          .split(",")
          .map((user) => ({ email: user })),
      },
    },
  });
  redirect(`/${project.id}`);
}

export default createProject;
