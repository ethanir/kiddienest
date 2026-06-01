"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

const triggerBase =
  "justify-between rounded-xl border-slate-200 bg-white px-3 font-normal text-slate-900 shadow-none [&_svg]:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-100 data-[placeholder]:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:[&_svg]:text-slate-500 dark:focus-visible:border-emerald-500 dark:focus-visible:ring-emerald-500/20";

const sizeCls: Record<"default" | "sm", string> = {
  default: "!h-11 w-full text-sm",
  sm: "!h-9 w-28 rounded-lg text-xs",
};

const contentCls =
  "rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-lg ring-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

const itemCls =
  "rounded-lg py-2 pr-8 pl-2.5 text-sm focus:bg-emerald-50 focus:text-emerald-700 data-[state=checked]:font-medium data-[state=checked]:text-emerald-700 dark:focus:bg-emerald-500/10 dark:focus:text-emerald-400 dark:data-[state=checked]:text-emerald-400";

export function SelectField({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  size = "default",
  className,
  ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger aria-label={ariaLabel} className={cn(triggerBase, sizeCls[size], className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" align="start" sideOffset={6} className={contentCls}>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className={itemCls}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
