import { Select } from "@mantine/core";
import ProjectContext from "contexts/ProjectContext";
import { useContext } from "react";

export default function UserSelect({ label, value, onChange }) {
  const { project } = useContext(ProjectContext);
  return (
    <Select
      placeholder="Select user"
      label={label}
      data={project.users.map((user) => ({
        value: user.email,
        label: user.name,
        disabled: value === user.email,
      }))}
      onChange={onChange}
      value={value}
    />
  );
}
