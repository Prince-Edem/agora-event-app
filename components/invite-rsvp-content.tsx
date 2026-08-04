import { prisma } from '@/lib/prisma'
import { Button } from './ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type {RsvpStatus as PrismaRsvpStatus } from '@/app/generated/prisma/enums';
import { notFound } from 'next/navigation';
import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { submitOrUpdateRsvpAction } from '@/lib/actions/events';

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
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,

  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);


  return (
  <div className="mx-auti w-full max-w-2xl py-16 md:py-18">
    <Card>
      <CardHeader className="space-y-3">
        <Badge variant="secondary" className="w-fit">RSVP</Badge>
        <CardTitle>
          {event.title}
          <p className='text-sm text-muted-foreground'>
            {event.eventDate
            ? new Date(event.eventDate).toLocaleString()
            : "No date selected"
            }
            {event.location ? ` - ${event.location}`: ""}
          </p>
          {event.description ? (
            <p className='text-sm text-muted-foreground'>
              {event.description}
            </p>
          ): null
          }
        </CardTitle>
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
              <Input id="name" name="name" required placeholder="Your name"/>
            </Field>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input id="email" name="email" type="email" required placeholder="you@example.com"/>
            </Field>
            <Field>
              <FieldLabel htmlFor='status'>Attendance</FieldLabel>
              <select
                id="status"
                name="status"
                required
                defaultValue="going"
                className='flex h-10 w-full rounded-md border-border bg-surface px-3 py-2'
              >
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not_going">Not going</option>
              </select>
            </Field>   
            <div className='mx-auto max-w-full py-3'>
              <Button type="submit">Submit RSVP</Button>
            </div>         
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
  )
}