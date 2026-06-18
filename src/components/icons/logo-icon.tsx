import { cn } from "@/lib/utils";
import Image from "next/image";

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/logo-wordmark.png"
      alt="Twelve Creative"
      width={160}
      height={34}
      className={cn("w-auto", className)}
    />
  );
};
