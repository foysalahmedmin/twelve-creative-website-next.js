import { format } from "date-fns";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSystemLogs, type SystemLogLevel } from "@/lib/api/system-logs";

export const dynamic = "force-dynamic";

type Tone = "positive" | "warning" | "danger";

const LEVEL_TONE: Record<SystemLogLevel, Tone> = {
  info: "positive",
  warn: "warning",
  error: "danger",
};

export default async function SystemLogsPage() {
  const { data, meta } = await getSystemLogs({ limit: 100 });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="System Logs"
        description={`${meta?.total ?? data.length} entries (last 100 shown)`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Tech Ops" },
          { label: "System Logs" },
        ]}
      />

      <Card className="overflow-hidden p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-foreground text-sm font-medium">No logs yet</p>
            <p className="text-muted-foreground text-sm">
              System events such as admin sign-ins will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                    {format(new Date(log.created_at), "d MMM yy, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={log.level} tone={LEVEL_TONE[log.level]} />
                  </TableCell>
                  <TableCell className="text-foreground text-sm">
                    {log.message}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {log.actor ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
