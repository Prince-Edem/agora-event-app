import { prisma } from '@/lib/prisma'
import { Button } from './ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type {RsvpStatus as PrismaRsvpStatus } from '@/app/generated/prisma/enums';
import { Share2 } from 'lucide-react';

function capitalizeFirst(value: string | null) {
  if (!value) return value;
  return value.replace(/^\s*([a-z])/, (_, first) => first.toUpperCase());
}

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
    title: capitalizeFirst(e.title),
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
    location: capitalizeFirst(e.location),
    ...countByStatus(e.rsvps),
  }))

  return (
  <div className="grid gap-6 py-16 md:py-18">
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Events</h1>
        <p className="text-sm text-muted-foreground">
          Track attendee responses and manage invite links
        </p>
      </div>
      <div className="justify-self-start md:justify-self-end">
        <Button asChild className="px-6 py-5 cursor-pointer">
          <Link href={"/events/new"}>Create event</Link>
        </Button>
      </div>
    </div>

    {/* List of events */}
    {events.length === 0 ? 
    (<Card className="pb-14 pt-8 shadow-md">
      <CardHeader>
        <CardTitle>No events yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Create your first event to start collecting RSVPs!
        </p>
      </CardContent>
    </Card>) : (
    <div className="grid gap-4 md:grid-cols-2  max-w-5xl w-full mx-auto">
      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`} className="group">
          <Card className="h-full space-y-4 py-6 shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="space-y-4">
              <div className='flex items-center justify-between gap-3'>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg wrap-break-word">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "No date set"}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                </div>
                <div className='flex shrink-0 items-center justify-between gap-3 font-semibold'>
                  <div>
                    <span className='text-emerald-600'>{event.goingCount}</span> going
                  </div>
                </div>
              </div>
            </CardHeader> 
          </Card>
        </Link>
      ))}
    </div>)
    }
  </div>
  )
}