import { Container } from "@mantine/core";
import ProjectPage from "components/ProjectPage";
import prisma from "lib/prisma";

export default async function Page({
  params,
}: {
  params: { project_id: string },
}) {
  const project = await prisma.project.findUniqueOrThrow({
    where: {
      id: params.project_id,
    },
    include: {
      users: true,
      receipts: {
        include: {
          users: true,
          receipt_items: {
            include: {
              users: true,
            },
          },
          user_proportions: true,
        },
      },
    },
  });
  return (
    <Container size="lg">
      <ProjectPage project={JSON.parse(JSON.stringify(project))} />
    </Container>
  );
}
