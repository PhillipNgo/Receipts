import { AppShell, Group, NavLink } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

type Route = {
  name: string,
  route: string,
};

const ROUTES: Array<Route> = [
  { name: "Home", route: "/" },
  { name: "Upload Receipt", route: "/upload" },
];

export default function Navbar({ opened, toggle }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AppShell.Navbar p="md">
      <Group gap="xs">
        {ROUTES.map(({ name, route }) => (
          <NavLink
            key={name}
            onClick={() => {
              router.push(route);
              if (opened) {
                toggle();
              }
            }}
            label={name}
            active={pathname === route}
          />
        ))}
      </Group>
    </AppShell.Navbar>
  );
}
