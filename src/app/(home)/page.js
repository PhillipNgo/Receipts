"use client";

import { Button, Center, Title } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";
import { signOut, useSession } from "next-auth/react";

const styles = stylex.create({
  container: {
    height: 500,
  },
});

export default function Home() {
  const session = useSession();
  return (
    <Center {...stylex.props(styles.container)}>
      <Title>Hello {session.data.user.name}</Title>
    </Center>
  );
}
