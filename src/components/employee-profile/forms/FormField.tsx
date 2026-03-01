import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BaseFieldProps {
  label: string;
  required?: boolean;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: "text" | "email" | "tel" | "date" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

interface SwitchFieldProps extends BaseFieldProps {
  type: "switch";
  checked: boolean;
  onChange: (checked: boolean) => void;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps | SwitchFieldProps;

export const ProfileFormField = (props: FormFieldProps) => {
  const { label, required, className = "" } = props;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {props.type === "textarea" ? (
        <Textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="bg-background"
        />
      ) : props.type === "select" ? (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={props.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : props.type === "switch" ? (
        <Switch checked={props.checked} onCheckedChange={props.onChange} />
      ) : (
        <Input
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="bg-background"
        />
      )}
    </div>
  );
};
