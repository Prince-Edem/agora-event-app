import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShareEventButton } from "./share-event-modal";
import { AttendeeList } from "./attendee-list";
import { ArrowLeft, CalendarDays, MapPin, SquarePen } from 'lucide-react';


export async function EventDetailContent({userId, eventId}: {userId: string, eventId: string}) {

  const row = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      invite: { select: { token: true } },
      rsvps: { select: { status: true } }
    }
  });

  if (!row) {
    notFound();
  }

  const counts = countByStatus(row.rsvps);

  const eventDate = row.eventDate ? new Date(row.eventDate) : null;

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate,
    inviteToken: row.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  }
  
  const rsvpRows = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  })

  const rsvps = rsvpRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email, 
    status: r.status,
    respondedAt: r.respondedAt.toISOString(),
  }))

  const eventDateLabel = event.eventDate
    ? `${event.eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · ${event.eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : null;
  const inviteUrl = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}` : null

  return (
    <div className="flex flex-col gap-6 py-16 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface"><ArrowLeft className="h-4 w-4" /></span>
              Back
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-8">{event.title}</h1>
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
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="px-4 py-5">
            <Link href={`/events/${event.id}/edit`}>
              <SquarePen className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <ShareEventButton eventId={event.id} eventTitle={event.title} initialInviteUrl={inviteUrl} />
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3">
        <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground md:block md:rounded-3xl md:p-6 md:text-center md:text-sm">
          <span>Going</span>
          <span className="ml-2 text-sm font-semibold text-emerald-500 md:mt-3 md:block md:ml-0 md:text-3xl">{event.goingCount}</span>
        </div>
        <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground md:block md:rounded-3xl md:p-6 md:text-center md:text-sm">
          <span>Maybe</span>
          <span className="ml-2 text-sm font-semibold text-amber-500 md:mt-3 md:block md:ml-0 md:text-3xl">{event.maybeCount}</span>
        </div>
        <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground md:block md:rounded-3xl md:p-6 md:text-center md:text-sm">
          <span>Not going</span>
          <span className="ml-2 text-sm font-semibold text-destructive md:mt-3 md:block md:ml-0 md:text-3xl">{event.notGoingCount}</span>
        </div>
      </div>
      <AttendeeList rsvps={rsvps} />
    </div>
  );
}