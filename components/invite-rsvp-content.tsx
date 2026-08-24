import { prisma } from '@/lib/prisma'
import { CalendarDays, MapPin } from 'lucide-react';
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { notFound } from 'next/navigation';
import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { submitOrUpdateRsvpAction } from '@/lib/actions/events';
import { AttendanceSelector } from './attendance-selector';

export async function InviteRsvpContent({token, submitted}: 
  { token: string;
    submitted: boolean;
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
        {submitted ? (
          <p className="mb-4 p-3 rounded-md border border-accent/50 bg-accent/15">
            Thanks. Your RSVP has been recorded (or updated).
          </p>
        ) : null}
        <form action={submitRsvpForToken}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='name'>Name</FieldLabel>
              <Input id="name" name="name" required placeholder="Kofi Sarpong"/>
            </Field>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input id="email" name="email" type="email" required placeholder="kofisarpong@email.com"/>
            </Field>
            <Field>
              <FieldLabel>Will you attend?</FieldLabel>
              <AttendanceSelector />
            </Field>   
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" className="px-5 py-5">Submit RSVP</Button>
            </div>         
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    </div>
  </div>
  )
}