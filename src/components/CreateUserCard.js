"use client";

import { Button, Card, Text, Stack, TextInput } from "@mantine/core";
import createUser from "actions/createUser";
import { useRef, useState } from "react";

export default function CreateUserCard() {
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef();

  return (
    <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
      <form
        onSubmit={() => setIsSaving(true)}
        action={async (data) => {
          await createUser(data);
          setIsSaving(false);
          formRef.current.reset();
        }}
        ref={formRef}
      >
        <Stack>
          <Text fw={500}>Create a user</Text>
          <TextInput name="name" label="Name" placeholder="Enter a name" />
          <TextInput
            name="email"
            label="Email"
            placeholder="Enter an email address"
          />
          <Button
            variant="primary"
            type="submit"
            disabled={isSaving}
            loading={isSaving}
          >
            Create
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
