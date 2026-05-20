"use client";

import { Archive, ArchiveRestore, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteContactMessageAction,
  updateContactMessageAction,
} from "@/lib/api/contact-messages-actions";
import type { ContactMessage } from "@/lib/api/contact-messages";

interface Props {
  message: ContactMessage;
}

export function MessageDetailActions({ message }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Mark as read automatically on first open (only if unread and not archived).
  useEffect(() => {
    if (message.is_read || message.is_archived) return;
    void (async () => {
      const res = await updateContactMessageAction(message._id, { is_read: true });
      if (res.ok) router.refresh();
    });
  }, [message._id, message.is_read, message.is_archived, router]);

  const run = async (
    action: () => Promise<{ ok: boolean; error?: string }>,
    success: string,
  ) => {
    setPending(true);
    const res = await action();
    setPending(false);
    if (!res.ok) {
      toast.error(res.error ?? "Action failed");
      return;
    }
    toast.success(success);
    router.refresh();
  };

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.subject || "Your message"}`,
  )}`;

  return (
    <>
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={replyHref}>
                <Reply className="size-4" />
                Reply via email
              </a>
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() =>
                run(
                  () =>
                    updateContactMessageAction(message._id, {
                      is_read: !message.is_read,
                    }),
                  message.is_read ? "Marked unread" : "Marked read",
                )
              }
            >
              {message.is_read ? (
                <>
                  <Mail className="size-4" />
                  Mark unread
                </>
              ) : (
                <>
                  <MailOpen className="size-4" />
                  Mark read
                </>
              )}
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() =>
                run(
                  () =>
                    updateContactMessageAction(message._id, {
                      is_archived: !message.is_archived,
                    }),
                  message.is_archived ? "Restored" : "Archived",
                )
              }
            >
              {message.is_archived ? (
                <>
                  <ArchiveRestore className="size-4" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="size-4" />
                  Archive
                </>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmingDelete(true)}
            disabled={pending}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete this message?"
        description="Removes the message from the admin inbox. The record can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          const res = await deleteContactMessageAction(message._id);
          if (!res.ok) {
            toast.error(res.error ?? "Failed to delete");
            return;
          }
          toast.success("Message deleted");
          router.push("/admin/messages");
          router.refresh();
        }}
      />
    </>
  );
}
