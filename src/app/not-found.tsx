import { Button } from "@/components/ui/button";
import { HealthIcon, Home01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center md:py-20">
      <div className="relative mb-6">
        <div className="bg-primary/10 absolute inset-0 rounded-full blur-3xl" />
        <div className="text-primary relative text-8xl font-bold tracking-tighter sm:text-9xl">
          404
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
        Page Not Found
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed sm:text-base">
        The page you are looking for has been moved or doesn&apos;t exist. 
        Don&apos;t worry, our doctors are still available for other services!
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-10 gap-2 rounded-xl px-8 text-xs font-bold shadow-md transition-all active:scale-95">
          <Link href="/">
            <HugeiconsIcon icon={Home01Icon} size={18} />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-10 gap-2 rounded-xl px-8 text-xs font-bold transition-all active:scale-95">
          <Link href="/doctors">
            <HugeiconsIcon icon={Search01Icon} size={18} />
            Find a Doctor
          </Link>
        </Button>
      </div>
    </div>
  );
}
