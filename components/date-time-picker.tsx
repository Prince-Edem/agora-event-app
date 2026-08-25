"use client";

import { useRef } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateTimePicker({
  id,
  name,
  type,
  value,
  onChange,
  min,
  placeholder,
  "aria-label": ariaLabel,
}: {
  id: string;
  name: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder: string;
  "aria-label": string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = type === "date" ? CalendarDays : Clock;
  const displayValue = type === "date" && value
    ? value.split("-").reverse().join("/")
    : type === "time" && value
      ? (() => {
          const [hours, minutes] = value.split(":").map(Number);
          const period = hours >= 12 ? "PM" : "AM";
          const displayHours = hours % 12 || 12;
          return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
        })()
      : value;
  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.click();
    }
  };

  return (
    <div className="relative w-full min-w-0">
      <button
        type="button"
        aria-label={`Choose ${ariaLabel.toLowerCase()}`}
        onClick={openPicker}
        className={cn(
          "flex h-8 w-full min-w-0 items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <Icon aria-hidden="true" className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        min={min}
        required
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        tabIndex={-1}
      />
    </div>
  );
}
