import { Container } from "@mantine/core";
import ProjectPage from "components/ProjectPage";
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
    <Container size="lg">
      <ProjectPage project={JSON.parse(JSON.stringify(project))} />
    </Container>
  );
}
