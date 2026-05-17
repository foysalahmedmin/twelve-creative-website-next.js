import { cn } from "@/lib/utils";
import Image from "next/image";

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Logo"
      width={32}
      height={32}
      className={cn("w-auto", className)}
    />
  );
};
