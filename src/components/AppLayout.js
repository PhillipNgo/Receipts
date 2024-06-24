"use client";

import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Header from "components/Header";
import Navbar from "components/Navbar";

export default function AppLayout({ children, projects }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar onNav={close} projects={projects} />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
