"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Globe, LockKeyhole, Share2, X } from "lucide-react";
import { createInviteLinkAction } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";

export function ShareEventButton({
  eventId,
  eventTitle,
  initialInviteUrl,
}: {
  eventId: string;
  eventTitle: string;
  initialInviteUrl: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState(initialInviteUrl);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const createInvite = () => {
    startTransition(async () => {
      const token = await createInviteLinkAction(eventId);
      setInviteUrl(`${window.location.origin}/invite/${token}`);
    });
  };

  const copyLink = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Button type="button" variant="outline" className="p-4" onClick={() => setIsOpen(true)}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="w-full max-w-xl rounded-2xl bg-card p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="share-dialog-title" className="text-2xl font-semibold">Share event</h2>
                <p className="mt-1 text-sm text-muted-foreground">Share “{eventTitle}” with your guests.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close share dialog" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <div className="flex items-center gap-4 border-b border-border p-4">
                <LockKeyhole className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Keep private</p>
                  <p className="text-sm text-muted-foreground">Only invited guests can access this event</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-muted/30 p-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Create public link</p>
                  <p className="text-sm text-muted-foreground">Anyone with the link can view and RSVP</p>
                </div>
                {inviteUrl && <Check className="h-5 w-5 text-primary" />}
              </div>
            </div> */}

            {inviteUrl ? (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background p-2 pl-4">
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{inviteUrl}</span>
                <Button type="button" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={createInvite} disabled={isPending}>
                  {isPending ? "Creating link..." : "Create share link"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}