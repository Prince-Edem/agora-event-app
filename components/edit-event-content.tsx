"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import { updateEventAction, deleteEventAction } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EventValues = {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  eventTime: string;
};

export default function EditEventContent({
  eventId,
  event,
}: {
  eventId: string;
  event: EventValues;
}) {
  const [values, setValues] = useState(event);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const today = useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }, []);

  const now = useMemo(() => {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }, []);

  const updateValue = (field: keyof EventValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    await updateEventAction(eventId, formData);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    await deleteEventAction(eventId);
  };

  return (
    <div className="w-full py-16 md:py-16">
      <div className="w-full">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href={`/events/${eventId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface"><ArrowLeft className="h-4 w-4" /></span>
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-2xl">
        <Card className="pb-14 pt-8 shadow-md">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">Edit event</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Event name</FieldLabel>
                <Input id="title" name="title" value={values.title} onChange={(e) => updateValue("title", e.target.value)} required />
              </Field>

              <div className="md:grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <Input id="eventDate" name="eventDate" type="date" value={values.eventDate} min={values.eventDate < today ? undefined : today} onChange={(e) => updateValue("eventDate", e.target.value)} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="eventTime">Time</FieldLabel>
                  <Input id="eventTime" name="eventTime" type="time" value={values.eventTime} min={values.eventDate === today ? now : undefined} onChange={(e) => updateValue("eventTime", e.target.value)} required />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input id="location" name="location" value={values.location} onChange={(e) => updateValue("location", e.target.value)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" name="description" value={values.description} onChange={(e) => updateValue("description", e.target.value)} rows={5} required />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" className="px-5 py-5" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
                <Button type="button" variant="outline" asChild className="px-5 py-5">
                  <Link href={`/events/${eventId}`}>Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>

          <section className="mt-8 border-t border-border pt-6" aria-labelledby="danger-zone-title">
            <h2 id="danger-zone-title" className="text-lg font-medium text-destructive">Delete this event</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              This removes the event and its guest list permanently. Guests will no longer be able to view or RSVP.
            </p>
            <Button type="button" variant="destructive" className="mt-4" onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete event"}
            </Button>
          </section>
        </CardContent>
        </Card>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl bg-card p-7 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 id="delete-dialog-title" className="mt-5 text-xl font-semibold">
              Delete “{event.title}”?
            </h2>
            <p id="delete-dialog-description" className="mt-2 text-sm leading-6 text-muted-foreground">
              This removes the event and its guest list permanently. Guests will no longer be able to view or RSVP. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete event"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}