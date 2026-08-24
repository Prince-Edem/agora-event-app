import { InviteRsvpContent } from "@/components/invite-rsvp-content";

export default async function invitePage({ params, searchParams }: 
  {params: Promise<{token: string}>;
  searchParams: Promise<{ submitted?: string; email?: string }>;
}) {

  const { token } = await params;
  const query = await searchParams;

  return <InviteRsvpContent token={token} submitted={query.submitted === "1"} submittedEmail={query.email} />;
}