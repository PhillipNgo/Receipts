"use client";

import { Button, Card, Image, Group, Text, Badge, Stack } from "@mantine/core";
import { Link } from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt={project.name}
          />
        </Card.Section>
        <Group align="center" justify="space-between" gap="xs">
          <Text fw={500}>{project.name}</Text>
          <Badge tt="none" variant="gradient" color="blue">
            {project.id}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {project.users.map((user) => user.name).join(", ")}
        </Text>
        <Button
          component="a"
          href={project.id}
          color="orange"
          fullWidth
          radius="md"
        >
          Open project
        </Button>
      </Stack>
    </Card>
  );
}
