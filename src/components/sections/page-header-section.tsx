import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItemType[];
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  breadcrumb,
  className,
}: PageHeaderProps) => {
  return (
    <section
      className={cn(
        "bg-muted/50 border-border/50 border-b py-8 md:py-12 lg:py-16",
        className,
      )}
    >
      <div className="container flex flex-col items-center justify-center text-center">
        {/* Breadcrumbs */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList className="justify-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.active || !item.href ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Title & Description */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75em]">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mx-auto text-sm leading-relaxed sm:text-base lg:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
