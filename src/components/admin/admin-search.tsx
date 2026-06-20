"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  placeholder?: string;
}

export function AdminSearch({ placeholder = "Search…" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const push = (v: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (v) {
      p.set("search", v);
    } else {
      p.delete("search");
    }
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(v), 400);
  };

  const handleClear = () => {
    setValue("");
    clearTimeout(debounceRef.current);
    push("");
  };

  return (
    <div className="relative max-w-xs w-full">
      <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
      <Input
        className="pl-8 pr-8 text-sm h-9"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9"
          onClick={handleClear}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
