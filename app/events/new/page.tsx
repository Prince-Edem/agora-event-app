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
    <div className="mx-auto w-full max-w-2xl py-16 md:py-18">
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

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    placeholder="dd/mm/yyyy"
                    required
                    min={today}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="eventTime">Time</FieldLabel>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    placeholder="--:-- --"
                    required
                    min={minTime}
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
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
  );
}