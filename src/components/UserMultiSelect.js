import {
  CheckIcon,
  Combobox,
  Group,
  InputBase,
  Pill,
  PillsInput,
  useCombobox,
  useMatches,
} from "@mantine/core";
import ProjectContext from "contexts/ProjectContext";
import { useContext } from "react";

export default function UserMultiSelect({
  label,
  value,
  onChange,
  responsive = false,
}) {
  const { project } = useContext(ProjectContext);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const maxPills = useMatches({
    base: responsive ? 0 : 3,
    sm: responsive ? 1 : 3,
    md: responsive ? 2 : 3,
    lg: 3,
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
      .slice(0, maxPills)
      .map((val) => (
        <Pill key={val}>
          {project.users.find((user) => user.email === val).name}
        </Pill>
      ));
    if (value.length > maxPills) {
      pills.push(<Pill key="other">+{value.length - maxPills}</Pill>);
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
