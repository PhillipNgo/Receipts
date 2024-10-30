"use client";

import type SplitType from "types/SplitType";

import {
  Button,
  Loader,
  Modal,
  MultiSelect,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import createProject from "actions/createProject";
import queryUsers from "actions/queryUsers";

export default function CreateProjectModal({ opened, onClose }) {
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const [isSaving, setIsSaving] = useState(false);
  const [shownUsers, setShownUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const onSearchChange = useDebouncedCallback((query) => {
    if (query.length > 2) {
      setIsLoadingUsers(true);
      queryUsers(query).then((response) => {
        setShownUsers((prevUsers) => {
          const newUsers = [...prevUsers];
          response.forEach((user) => {
            if (
              newUsers.find((newUser) => newUser.email === user.email) == null
            ) {
              newUsers.push(user);
            }
          });
          return newUsers.sort((a, b) => a.name.localeCompare(b.name));
        });
        setIsLoadingUsers(false);
      });
    }
  }, 500);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={mediaQuery}
      size="lg"
      title="Create a project"
      removeScrollProps={{
        allowPinchZoom: true,
      }}
    >
      <form
        onSubmit={() => setIsSaving(true)}
        action={async (data) => {
          await createProject(data);
          setIsSaving(false);
          onClose();
        }}
      >
        <Stack>
          <TextInput
            name="projectName"
            label="Project Name"
            placeholder="My Project Name"
          />
          <TextInput
            name="projectCode"
            label="Project ID"
            placeholder="my_project_code"
          />
          <MultiSelect
            label="Intial users"
            placeholder="Search for a user..."
            data={shownUsers.map((user) => ({
              value: user.email,
              label: user.name,
            }))}
            searchable
            name="users"
            onSearchChange={onSearchChange}
            rightSection={isLoadingUsers && <Loader size={16} />}
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
    </Modal>
  );
}
