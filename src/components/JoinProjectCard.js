"use client";

import { Button, Card, Image, Text, Input, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function JoinProjectCard() {
  const [opened, { open, close }] = useDisclosure(false);
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
        <Input placeholder="Project code" />
        <Button color="orange" fullWidth radius="md">
          Join
        </Button>
      </Stack>
    </Card>
  );
}
