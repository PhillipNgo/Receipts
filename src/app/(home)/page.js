import {
  Button,
  Card,
  Center,
  Container,
  Title,
  Image,
  Text,
  SimpleGrid,
  Stack,
  Flex,
} from "@mantine/core";
import * as stylex from "@stylexjs/stylex";
import AddProjectCard from "components/JoinProjectCard";
import ProjectCard from "components/ProjectCard";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

const styles = stylex.create({
  container: {},
});

export default async function Home() {
  const session = await getServerSession();
  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: {
          email: session.user.email,
        },
      },
    },
    include: {
      users: true,
    },
  });
  return (
    <Container size="xl">
      <Center {...stylex.props(styles.container)}>
        <Stack>
          <Title>Hello {session.user.name}</Title>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <Center>
              <AddProjectCard />
            </Center>
          </SimpleGrid>
        </Stack>
      </Center>
    </Container>
  );
}
