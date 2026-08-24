"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma} from "../prisma";
import type { RsvpStatus } from "@/app/generated/prisma/enums";

function capitalizeFirst(value: string) {
  return value.replace(/^\s*([a-z])/, (_, first) => first.toUpperCase());
}

function parseEvent(formData: FormData) {
  const title = capitalizeFirst(String(formData.get("title") ?? "").trim());
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters.");
  }

  const description = capitalizeFirst(String(formData.get("description") ?? "").trim());
  const location = capitalizeFirst(String(formData.get("location") ?? "").trim());
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const eventTime = String(formData.get("eventTime") ?? "").trim();

  const dateTime = eventDate && eventTime
    ? `${eventDate}T${eventTime}:00`
    : eventDate;

  return {
    title, 
    description: description.length ? description.slice(0, 2000) : null,
    location: location.length ? location.slice(0, 200) : null,
    eventDate: dateTime.length ? dateTime : null,
  };
}

const RSVP_STATUSES = ["going", "maybe", "not_going"] as const;

function isRsvpStatus(s: string): s is RsvpStatus {
  return (RSVP_STATUSES as readonly string[]).includes(s);
}

function parseRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  const email = String(formData.get("email") ?? "").trim();
  if (email.length < 3 || email.length > 320 || !email.includes("@")) {
    throw new Error("Please enter a valid email.");
  }

  const status = String(formData.get("status") ?? "").trim();
  if (!isRsvpStatus(status)) {
    throw new Error("Invalid RSVP status.")
  }

  return { name, email, status};
}

export async function createEventAction(formData: FormData) {
  const session = await getSession();
  const userId = session?.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated.");
  }
  const input = parseEvent(formData);
  if (!input.eventDate) {
    throw new Error("Event date is required.");
  }

  try {
  const created = await prisma.event.create({
    data: {
      ownerUserId: userId,
      title: input.title,
      description: input.description,
      location: input.location,
      eventDate: new Date(input.eventDate),
    },
  });
    return created;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create event.");
  }

}

export async function createInviteLinkAction(eventId: string) {
  const session = await getSession();
  const userId = session?.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated.");
  }
  const owns = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });

  if (!owns) {
    throw new Error("Event not found.");
  }

  const token = crypto.randomUUID().replace(/-/g, "");

  await prisma.eventInvite.upsert({
    where: { eventId },
    create: { eventId, token },
    update: { token },
  });

}



export async function submitOrUpdateRsvpAction(token: string, formData: FormData) {
  const input = parseRsvp(formData);

  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      id: true,
      event: {
        select: { id: true }
      }
    }
  })

  if (!invite) {
    throw new Error("Invite link is invalid.");
  }

  const eventId = invite.event.id;
  const emailNormalized = input.email.toLowerCase();

  await prisma.eventRsvp.upsert({
    where: {
      eventId_emailNormalized: {
        eventId,
        emailNormalized,
      },
    },

    create: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: input.status,
    },

    update: {
      name: input.name,
      status: input.status,
      respondedAt: new Date(),
    },
  })
  
  redirect(`/invite/${token}?submitted=1`);
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const session = await getSession();
  const userId = session?.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const input = parseEvent(formData);
  if (!input.eventDate) {
    throw new Error("Event date is required.");
  }

  const ownedEvent = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });
  if (!ownedEvent) {
    throw new Error("Event not found.");
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title: input.title,
      description: input.description,
      location: input.location,
      eventDate: new Date(input.eventDate),
    },
  });

  redirect(`/events/${eventId}`);
}

export async function deleteEventAction(eventId: string) {
  const session = await getSession();
  const userId = session?.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const deleted = await prisma.event.deleteMany({
    where: { id: eventId, ownerUserId: userId },
  });
  if (deleted.count === 0) {
    throw new Error("Event not found.");
  }

  redirect("/dashboard");
}