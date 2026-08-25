"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/events";
import { ArrowLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="px-5 py-5 cursor-pointer" disabled={pending}>
      {pending ? "Creating..." : "Create Event"}
    </Button>
  );
}

export default function NewEventPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const now = useMemo(() => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }, []);

  const minTime = eventDate === today ? now : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createEventAction(formData);
      formRef.current?.reset();
      setEventDate("");
      setEventTime("");
      router.push("/dashboard");
    } catch {
      // Error is handled by Next.js or can be shown here
    }
  };

  return (
    <div className="w-full py-16 md:py-16">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface"><ArrowLeft className="h-4 w-4" /></span>
          Back
        </Link>
      </div>

      <div className="mx-auto mt-8 w-full max-w-2xl">
      <Card className="pb-14 pt-8 shadow-md">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">Create an event</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Event name</FieldLabel>
                <Input id="title" name="title" placeholder="Adjei-Mensah wedding" required />
              </Field>

              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-4">
                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <div className="relative w-full min-w-0">
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      aria-label="Date (dd/mm/yyyy)"
                      required
                      min={today}
                      value={eventDate}
                      className={`block w-full min-w-0 max-w-full box-border ${!eventDate ? "date-time-input-empty" : ""}`}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                    {!eventDate && (
                      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-base text-muted-foreground md:text-sm">
                        dd/mm/yyyy
                      </span>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="eventTime">Time</FieldLabel>
                  <div className="relative w-full min-w-0">
                    <Input
                      id="eventTime"
                      name="eventTime"
                      type="time"
                      aria-label="Time"
                      required
                      min={minTime}
                      value={eventTime}
                      className={`block w-full min-w-0 max-w-full box-border ${!eventTime ? "date-time-input-empty" : ""}`}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                    {!eventTime && (
                      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-base text-muted-foreground md:text-sm">
                        --:-- --
                      </span>
                    )}
                  </div>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input id="location" name="location" placeholder="Labadi Beach, Accra" />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell your guests what to expect"
                  rows={5}
                  required
                />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SubmitButton />
                <Button type="button" variant="outline" asChild className="px-5 py-5 cursor-pointer">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}