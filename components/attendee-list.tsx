"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Rsvp = {
  id: string;
  name: string;
  status: "going" | "maybe" | "not_going";
  respondedAt: string;
};

export function AttendeeList({ rsvps }: { rsvps: Rsvp[] }) {
  const [filter, setFilter] = useState<"all" | Rsvp["status"]>("all");
  const filteredRsvps = filter === "all" ? rsvps : rsvps.filter((rsvp) => rsvp.status === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Guests</CardTitle>
        <div className="relative">
          <select
            aria-label="Filter attendees"
            value={filter}
            onChange={(event) => setFilter(event.target.value as "all" | Rsvp["status"])}
            className="h-9 appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All guests</option>
            <option value="going">Going</option>
            <option value="maybe">Maybe</option>
            <option value="not_going">Not going</option>
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredRsvps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No guests in this category.</p>
        ) : (
          <div>
          {filteredRsvps.map((rsvp) => {
            const initials = rsvp.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase();
            const statusLabel = rsvp.status === "not_going" ? "Not going" : rsvp.status === "maybe" ? "Maybe" : "Going";
            const statusClass = rsvp.status === "going"
              ? "bg-emerald-500/10 text-emerald-600"
              : rsvp.status === "not_going"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground";

            return (
              <div key={rsvp.id} className="flex min-h-16 items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {initials}
                  </span>
                  <div className="flex min-w-0 flex-col items-baseline gap-x-3 gap-y-1">
                    <span className="truncate font-medium">{rsvp.name}</span>
                    <span className="text-sm text-muted-foreground">
                      Updated • {new Date(rsvp.respondedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg px-3 py-2 text-sm ${statusClass}`}>
                  {statusLabel}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}