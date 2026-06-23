import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const ChevronSeparator = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 2l3 3-3 3" />
  </svg>
);

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
                  <ChevronSeparator />
                </span>
              )}
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="text-2xs tracking-label text-content-secondary hover:text-content-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-2xs tracking-label text-content-faint"
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
