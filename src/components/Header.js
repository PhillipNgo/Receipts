import { AppShell, Burger, Group, Title } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    padding: 8,
    width: "100%",
    justifyContent: "space-between",
  },
});

export default function Header({ opened, toggle }) {
  return (
    <AppShell.Header {...stylex.props(styles.header)}>
      <Group gap="xs">
        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
        <Title>Receipts</Title>
      </Group>
    </AppShell.Header>
  );
}
