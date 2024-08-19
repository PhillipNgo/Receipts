import { Select } from "@mantine/core";
import SplitType from "types/SplitType";

type Props = {
  onChange: (SpltType) => void,
};

function getLabel(type: SplitType) {
  switch (type) {
    case "SPLIT":
      return "Split";
    case "ITEMIZED":
      return "Itemized";
    case "PROPORTIONAL":
      return "Proportional";
  }
}

export default function SplitTypeSelector({ onChange, value }: Props) {
  return (
    <Select
      placeholder="Select receipt type"
      label="Receipt type"
      data={Array.from(SplitType.members()).map((type) => ({
        value: type,
        label: getLabel(type),
        disabled: value === type,
      }))}
      onChange={onChange}
      value={value}
    />
  );
}
