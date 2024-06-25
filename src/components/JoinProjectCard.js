"use client";

import { Button, Card, Image, Text, Input, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import joinProject from "actions/joinProject";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function JoinProjectCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [projectId, setProjectId] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
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
        <Text fw={500}>Join project</Text>
        <Input
          disabled={isPending}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Project code"
        />
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={async () =>
            startTransition(() => {
              joinProject(projectId).then(() => router.push(projectId));
            })
          }
          color="orange"
          fullWidth
          radius="md"
        >
          Join
        </Button>
      </Stack>
    </Card>
  );
}
