import { notFound, redirect } from "next/navigation";
import EditEventContent from "@/components/edit-event-content";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      title: true,
      description: true,
      location: true,
      eventDate: true,
    },
  });

  if (!event) {
    notFound();
  }

  const date = event.eventDate;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <EditEventContent
      eventId={eventId}
      event={{
        title: event.title,
        description: event.description ?? "",
        location: event.location ?? "",
        eventDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        eventTime: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
      }}
    />
  );
}