"use client";

import { Button, Group, Stack, Tabs, Title } from "@mantine/core";
import UploadModal from "./UploadModal";
import { useDisclosure } from "@mantine/hooks";

export default function ProjectNavbar({ project }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={2}>{project.name}</Title>
        <UploadModal opened={opened} onClose={close} />
        <Button onClick={open}>Upload receipt</Button>
      </Group>
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview"></Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
