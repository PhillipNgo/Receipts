"use client";

import { Button, Group, Stack, Tabs, Title } from "@mantine/core";
import UploadModal from "./UploadModal";
import { useDisclosure } from "@mantine/hooks";
import ProjectOverview from "./ProjectOverview";
import ProjectSettings from "./ProjectSettings";
import ProjectContext from "contexts/ProjectContext";

export default function ProjectPage({ project }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <ProjectContext.Provider value={project}>
      <Stack>
        <Group justify="space-between" align="center">
          <Group align="center" justify="space-between">
            <Title order={2}>{project.name}</Title>
          </Group>
          <UploadModal opened={opened} onClose={close} />
          <Button onClick={open}>Upload receipt</Button>
        </Group>
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">
            <ProjectOverview />
          </Tabs.Panel>
          <Tabs.Panel value="settings">
            <ProjectSettings />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ProjectContext.Provider>
  );
}
