import { Input } from "../../../components/Input";

type InputFieldsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InputFields({ value, onChange }: InputFieldsProps) {
  return (
    <Input
      label="Input Label"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Enter input label..."
    />
  );
}
