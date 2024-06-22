import { Select } from "@mantine/core";
import SplitType from "types/SplitType";

type Props = {
  onChange: (SpltType) => void,
};

export default function SplitTypeSelector({ onChange }: Props) {
  return (
    <Select
      label="Receipt type"
      data={Array.from(SplitType.members())}
      onChange={onChange}
    />
  );
}
