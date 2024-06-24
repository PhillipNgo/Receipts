import { Container } from "@mantine/core";
import ProjectNavbar from "components/ProjectNavbar";
import UploadModal from "components/UploadModal";
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
      receipts: true,
    },
  });
  return (
    <Container size="xl">
      <ProjectNavbar project={project} />
    </Container>
  );
}
