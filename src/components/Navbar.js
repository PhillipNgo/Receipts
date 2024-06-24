"use client";

import { AppShell, Stack, NavLink, Button, Divider } from "@mantine/core";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

type Route = {
  name: string,
  route: string,
};

export default function Navbar({ onNav, projects }) {
  const pathname = usePathname();
  return (
    <AppShell.Navbar p="md">
      <Stack grow={1} h="inherit" justify="space-between">
        <Stack gap="xs">
          <NavLink
            href="/"
            onClick={onNav}
            label={"Home"}
            active={pathname === "/"}
          />
          <Divider label="Your projects" />
          {projects.map((project) => (
            <NavLink
              key={project.id}
              href={project.id}
              onClick={onNav}
              label={project.name}
              active={pathname === `/${project.id}`}
            />
          ))}
        </Stack>
        <Stack>
          <Button color="orange" onClick={signOut}>
            Sign out
          </Button>
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
}
