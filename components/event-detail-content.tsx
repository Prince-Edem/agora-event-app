import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";


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

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
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
  const inviteUrl = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}` : null

  return (
    <div className="flex flex-col gap-6 py-16 md:py-18">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
          <p>
            {event.eventDate 
              ? new Date(event.eventDate).toLocaleString()
              : "No date selected"}

              {event.location ? ` - ${event.location}` : "" }
          </p>
          {event.description && 
            (<p className="max-w-2xl text-sm text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href={"/dashboard"}>
              Back
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>Going: {event.goingCount}</Badge>
        <Badge variant="secondary">Maybe: {event.maybeCount}</Badge>
        <Badge variant="outline">Not Going: {event.notGoingCount}</Badge>
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