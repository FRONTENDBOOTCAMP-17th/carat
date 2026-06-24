import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-content-faint" aria-hidden="true">
                  <ChevronRight size={10} strokeWidth={1.5} aria-hidden="true" />
                </span>
              )}
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="text-xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-xs tracking-label text-content-faint"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
