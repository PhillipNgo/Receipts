import { AppShell, Burger, Button, Group, Title } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";
import { signOut } from "next-auth/react";
import Link from "next/link";

const styles = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    padding: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  burger: {
    marginRight: 8,
  },
  title: {
    color: "inherit",
    textDecoration: "none",
  },
});

export default function Header({ opened, toggle }) {
  return (
    <AppShell.Header {...stylex.props(styles.header)}>
      <Burger
        {...stylex.props(styles.burger)}
        opened={opened}
        onClick={toggle}
        hiddenFrom="md"
        size="md"
      />
      <Link {...stylex.props(styles.title)} href="/">
        <Title>Receipts</Title>
      </Link>
      <Button onClick={() => signOut()}>Sign out</Button>
    </AppShell.Header>
  );
}
