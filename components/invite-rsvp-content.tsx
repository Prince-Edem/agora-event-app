import { prisma } from '@/lib/prisma'
import { CalendarDays, Check, MapPin } from 'lucide-react';
import { Button } from './ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { notFound } from 'next/navigation';
import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { submitOrUpdateRsvpAction } from '@/lib/actions/events';
import { AttendanceSelector } from './attendance-selector';

export async function InviteRsvpContent({token, submitted, submittedEmail}: 
  { token: string;
    submitted: boolean;
    submittedEmail?: string;
  }) {
  const rows = await prisma.eventInvite.findFirst({
    where: { token },
    include: {
      event: {
        select: {
        id: true,
        title: true,
        description: true,
        location: true,
        eventDate: true,
      }
    }
    }
  });

  if (!rows) {
    notFound();
  }

  const e = rows.event;
  const eventDate = e.eventDate ? new Date(e.eventDate) : null;

  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate,
  };

  const eventDateLabel = event.eventDate
    ? `${event.eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · ${event.eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : null;

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);
  const existingRsvp = submittedEmail
    ? await prisma.eventRsvp.findUnique({
        where: {
          eventId_emailNormalized: {
            eventId: rows.event.id,
            emailNormalized: submittedEmail.toLowerCase(),
          },
        },
        select: { name: true, email: true, status: true },
      })
    : null;


  return (
  <div className="w-full py-16 md:py-16">
    <div className="mx-auto mt-8 w-full max-w-2xl">
    <Card className="pb-14 pt-8 shadow-md">
      <CardHeader className="space-y-3">
        <Badge variant="secondary" className="w-fit">RSVP</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {eventDateLabel ? (
            <div className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {eventDateLabel}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              No date selected
            </div>
          )}
          {event.location && (
            <div className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
        </div>
        {event.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {submitted && existingRsvp ? (
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              {existingRsvp.status === "going" ? "You're going!" : existingRsvp.status === "maybe" ? "You're a maybe!" : "We'll miss you!"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks, {existingRsvp.name}. We&apos;ve let the hosts know about your response.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left text-sm">
              <div className="flex items-center justify-between gap-4 py-1">
                <span className="text-muted-foreground">Status</span>
                <span className={existingRsvp.status === "going" ? "font-medium text-emerald-600" : existingRsvp.status === "not_going" ? "font-medium text-destructive" : "font-medium text-amber-600"}>{existingRsvp.status === "going" ? "Going" : existingRsvp.status === "maybe" ? "Maybe" : "Can't go"}</span>
              </div>
            </div>
            <Button type="button" variant="outline" className="mt-5 w-full" asChild>
              <Link href={`/invite/${token}?email=${encodeURIComponent(existingRsvp.email)}`}>Change response</Link>
            </Button>
          </div>
        ) : (
        <form action={submitRsvpForToken}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='name'>Name</FieldLabel>
              <Input id="name" name="name" required placeholder="Kofi Sarpong" defaultValue={existingRsvp?.name}/>
            </Field>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input id="email" name="email" type="email" required placeholder="kofisarpong@email.com" defaultValue={existingRsvp?.email}/>
            </Field>
            <Field>
              <FieldLabel>Will you attend?</FieldLabel>
              <AttendanceSelector initialStatus={existingRsvp?.status} />
            </Field>   
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" className="px-5 py-5 cursor-pointer">Submit RSVP</Button>
            </div>         
          </FieldGroup>
        </form>
        )}
      </CardContent>
    </Card>
    </div>
  </div>
  )
}