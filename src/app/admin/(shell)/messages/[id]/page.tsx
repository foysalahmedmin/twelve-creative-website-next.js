import { format } from "date-fns";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/admin/types";
import { getContactMessageById } from "@/lib/api/contact-messages";
import { MessageDetailActions } from "./message-detail-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MessageDetailPage({ params }: PageProps) {
  const { id } = await params;

  let message;
  try {
    message = await getContactMessageById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <AdminPageHeader
        title={message.subject || "Contact message"}
        description={`From ${message.name} <${message.email}> · ${format(new Date(message.created_at), "d MMM yyyy 'at' p")}`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Messages", href: "/admin/messages" },
          { label: message.name },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sender details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <dt className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Name</dt>
            <dd className="sm:col-span-2">{message.name}</dd>
            <dt className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Email</dt>
            <dd className="sm:col-span-2">
              <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                {message.email}
              </a>
            </dd>
            {message.phone && (
              <>
                <dt className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Phone</dt>
                <dd className="sm:col-span-2">
                  <a href={`tel:${message.phone}`} className="text-primary hover:underline">
                    {message.phone}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      <MessageDetailActions message={message} />
    </div>
  );
}
