import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, CalendarDays, MapPin, Share2, SquarePen } from 'lucide-react';


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

  const createInviteActionForEvent = createInviteLinkAction.bind(null, event.id);

  function labelStatus(status: string) {
    if (status === "not_going") return "Not going";
    return "Going";
  }

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
              Back to events
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
          <Button asChild className="p-4">
            <Link href={`/events/${event.id}/edit`}>
              <SquarePen className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild variant="outline" className="p-4">
            <Link href="#share">
              <Share2 className="h-4 w-4"/>
              Share
            </Link>
          </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share this link with guests to allow them to RSVP to your event without needing to create an account.
          </p>
          {inviteUrl ? (
            <div className="rounded-md border border-border bg-surface p-3 text-sm">
              {inviteUrl}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No inivte link generated yet.
            </p>
          )
        }
          <form action={createInviteActionForEvent}>
            <Button type="submit">
              Generate Link
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
          <CardContent>
            {rsvps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No responses yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map((rsvp) => (
                    <TableRow>
                      <TableCell>{rsvp.name}</TableCell>
                      <TableCell>{rsvp.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {rsvp.status === "not_going" ? "not going" : rsvp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(rsvp.respondedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}