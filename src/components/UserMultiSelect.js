import {
  CheckIcon,
  Combobox,
  Group,
  InputBase,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";
import ProjectContext from "contexts/ProjectContext";
import { useContext } from "react";

const MAX_PILLS = 3;

export default function UserMultiSelect({ label, value, onChange }) {
  const { project } = useContext(ProjectContext);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleValueSelect = (selectedValue: string) => {
    if (selectedValue === "Everyone") {
      onChange([]);
    } else {
      const newValue = value.includes(selectedValue)
        ? value.filter((v) => v !== selectedValue)
        : [...value, selectedValue];
      onChange(newValue.length === project.users.length ? [] : newValue);
    }
  };

  let pills;
  const isEveryone = value == null || value.length === 0;
  if (isEveryone) {
    pills = [<Pill key="everyone">Everyone</Pill>];
  } else {
    pills = value
      .slice(0, MAX_PILLS)
      .map((val) => (
        <Pill key={val}>
          {project.users.find((user) => user.email === val).name}
        </Pill>
      ));
    if (value.length > MAX_PILLS) {
      pills.push(<Pill key="other">+{value.length - MAX_PILLS} others</Pill>);
    }
  }

  const options = project.users.map(({ email, name }) => (
    <Combobox.Option value={email} key={email} active={value.includes(email)}>
      <Group gap="sm">
        {value.includes(email) ? <CheckIcon size={12} /> : null}
        <span>{name}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
      <Combobox.Target>
        <InputBase
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          <Pill.Group>{pills}</Pill.Group>
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Option value="Everyone" disabled={isEveryone}>
            <Group gap="sm">
              {isEveryone ? <CheckIcon size={12} /> : null}
              <span>Everyone</span>
            </Group>
          </Combobox.Option>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
