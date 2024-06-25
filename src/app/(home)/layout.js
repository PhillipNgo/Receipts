import AppLayout from "components/AppLayout";

import prisma from "lib/prisma";
import { getServerSession } from "next-auth";

export default async function Layout({ children }) {
  const session = await getServerSession();
  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: {
          email: session.user.email,
        },
      },
    },
  });
  return <AppLayout projects={projects}>{children}</AppLayout>;
}
