import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoIconProps {
  className?: string;
  compact?: boolean;
}

const maskStyle = (src: string) => ({
  WebkitMaskImage: `url("${src}")`,
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskImage: `url("${src}")`,
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "contain",
});

export const LogoIcon = ({ className, compact = false }: LogoIconProps) => {
  if (compact) {
    return (
      <span
        role="img"
        aria-label="Twelve Creative"
        className={cn("inline-flex shrink-0 items-center", className)}
      >
        <span
          aria-hidden="true"
          className="h-[46%] aspect-[704/416] shrink-0 bg-[#ff6200]"
          style={maskStyle("/logo-symbol-orange.png")}
        />
        <span
          aria-hidden="true"
          className="-ml-0.5 h-[65%] aspect-[1081/209] shrink-0 bg-[#ff6200]"
          style={maskStyle("/logo-full.png")}
        />
      </span>
    );
  }

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
