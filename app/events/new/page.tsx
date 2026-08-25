"use client";

import { useState, useRef } from "react";
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
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY-MM-DD"
                    aria-label="Date (YYYY-MM-DD)"
                    autoComplete="off"
                    maxLength={10}
                    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="eventTime">Time</FieldLabel>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="text"
                    inputMode="numeric"
                    placeholder="HH:MM"
                    aria-label="Time (HH:MM)"
                    autoComplete="off"
                    maxLength={5}
                    pattern="[0-9]{2}:[0-9]{2}"
                    required
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
    </div>
  );
}