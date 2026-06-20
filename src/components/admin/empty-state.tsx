import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="text-foreground text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {action && (
        <Button asChild className="mt-3">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
