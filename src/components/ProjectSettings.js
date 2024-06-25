import { Button, Stack } from "@mantine/core";
import leaveProject from "actions/leaveProject";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ProjectSettings({ project }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Stack align="end">
      <div>
        <Button
          disabled={isPending}
          loading={isPending}
          color="red"
          mt="md"
          onClick={async () =>
            startTransition(() =>
              leaveProject(pathname.slice(1)).then(() => router.push("/"))
            )
          }
        >
          Leave project
        </Button>
      </div>
    </Stack>
  );
}
