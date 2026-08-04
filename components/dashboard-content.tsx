import { prisma } from '@/lib/prisma'
import { Button } from './ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type {RsvpStatus as PrismaRsvpStatus } from '@/app/generated/prisma/enums';

export function countByStatus(rsvps: {status: PrismaRsvpStatus}[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;

  for (const rsvp of rsvps) {
    if (rsvp.status === "going") goingCount++;
    else if (rsvp.status === "maybe") maybeCount++;
    else if (rsvp.status === "not_going") notGoingCount++;
  }

  return { goingCount, maybeCount, notGoingCount };
}

export async function DashboardContent({userId}: {userId: string}) {
  const rows = await prisma.event.findMany({
    where: { ownerUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      rsvps: { select: {status: true}},
    }
  });

  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
    location: e.location,
    ...countByStatus(e.rsvps),
  }))

  return (
  <div className="flex flex-col flex-1 gap-6 py-16 md:py-18">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Events</h1>
        <p className="text-sm text-muted-foreground">
          Track attendee responses and manage invite links
        </p>
      </div>
      <Button asChild>
        <Link href={"/events/new"}>Create event</Link>
      </Button>
    </div>

    {/* List of events */}
    {events.length === 0 ? 
    (<Card>
      <CardHeader>
        <CardTitle>No events yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Create your first event to start collecting RSVPs!
        </p>
      </CardContent>
    </Card>) : (
    <div className="grid md:grid-cols-2 gap-4 max-w-5xl w-full mx-auto">
      {events.map((event, key) => (
        <Link key={key} href={`/events/${event.id}`}>
          <Card key={event.id} className="space-y-3">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                {/* <Button size="sm" asChild>
                  <Link href={`/events/${event.id}`}>Open</Link>
                </Button> */}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge>Going: {event.goingCount}</Badge>
                <Badge variant="secondary">Maybe: {event.maybeCount}</Badge>
                <Badge variant="outline">Not Going: {event.notGoingCount}</Badge>
              </div>
              <p>
                {event.eventDate ? new Date(event.eventDate).toLocaleString() : "No date set"}
                {event.location ? ` - ${event.location}` : ""}
              </p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>)
    }
  </div>
  )
}