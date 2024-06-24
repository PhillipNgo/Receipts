import { AppShell, Burger, Group, Title } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

const styles = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    padding: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  title: {
    color: "inherit",
    textDecoration: "none",
  },
});

export default function Header({ opened, toggle }) {
  return (
    <AppShell.Header {...stylex.props(styles.header)}>
      <Group gap="xs">
        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
        <Link
          {...stylex.props(styles.title)}
          href="/"
          onClick={() => {
            if (opened) {
              toggle();
            }
          }}
        >
          <Title>Receipts</Title>
        </Link>
      </Group>
    </AppShell.Header>
  );
}
