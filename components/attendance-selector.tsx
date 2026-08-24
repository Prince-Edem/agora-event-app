"use client";

import { useState } from "react";
import { Check, CircleHelp, X } from "lucide-react";

const options = [
  { value: "going", label: "Going", icon: Check },
  { value: "maybe", label: "Maybe", icon: CircleHelp },
  { value: "not_going", label: "Can't go", icon: X },
] as const;

export function AttendanceSelector() {
  const [selected, setSelected] = useState<(typeof options)[number]["value"]>("going");

  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Will you attend?">
      {options.map(({ value, label, icon: Icon }) => {
        const isSelected = selected === value;

        return (
          <label
            key={value}
            className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-3 py-3 text-center transition-colors ${
              isSelected
                ? value === "going"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : value === "not_going"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            <input
              className="sr-only"
              type="radio"
              name="status"
              value={value}
              checked={isSelected}
              onChange={() => setSelected(value)}
            />
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-medium">{label}</span>
          </label>
        );
      })}
    </div>
  );
}