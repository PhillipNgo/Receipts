"use client";

import { Button, Card, Image, Text, Input, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import joinProject from "actions/joinProject";
import { useState, useTransition } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function CreateProjectCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [projectId, setProjectId] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
      <Stack>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            height={120}
            fit="cover"
            alt="Join project card"
          />
        </Card.Section>
        <Text fw={500}>Create a ...</Text>
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={open}
          color="orange"
          fullWidth
          radius="md"
        >
          New project
        </Button>
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={async () => {}}
          color="orange"
          fullWidth
          radius="md"
        >
          One time receipt
        </Button>
      </Stack>
      <CreateProjectModal opened={opened} onClose={close} />
    </Card>
  );
}
