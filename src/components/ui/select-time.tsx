import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectTimeProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const SelectTime = ({ value, onChange, id }: SelectTimeProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Выберите время" />
      </SelectTrigger>
      <SelectContent>
        {hours.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectTime;
