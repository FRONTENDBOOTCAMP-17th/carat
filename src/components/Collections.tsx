import Link from "next/link";
import CollectionCard from "./CollectionCard";

const collections = [
  {
    title: "Ring 01",
    description: "Lorem ipsum dolor sit amet",
    price: "₩10,000,000",
  },
  {
    title: "Ring 01",
    description: "Lorem ipsum dolor sit amet",
    price: "₩10,000,000",
  },
  {
    title: "Ring 01",
    description: "Lorem ipsum dolor sit amet",
    price: "₩10,000,000",
  },
  {
    title: "Ring 01",
    description: "Lorem ipsum dolor sit amet",
    price: "₩10,000,000",
  },
  {
    title: "Ring 01",
    description: "Lorem ipsum dolor sit amet",
    price: "₩10,000,000",
  },
];

export default function Collections() {
  return (
    <section
      className="max-w-container mx-auto bg-surface-darkest py-20"
      aria-labelledby="collections-heading"
    >
      <p className="mb-3 text-2xs tracking-descriptor text-content-dimmed">
        현대적인 조형성과 정교한 소재가 만나는 곳,
      </p>
      <p className="mb-3 text-2xs tracking-descriptor text-content-dimmed">
        PRISME의 컬렉션을 만나보세요.
      </p>

      <h2
        id="collections-heading"
        className="mb-14 text-4xl tracking-heading text-content-primary"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        COLLECTIONS
      </h2>

      <ul className="mb-12 grid grid-cols-5 gap-8" aria-label="컬렉션 목록">
        {collections.map((c, i) => (
          <li key={i}>
            <CollectionCard
              title={c.title}
              description={c.description}
              price={c.price}
            />
          </li>
        ))}
      </ul>

      <Link
        href="/collections"
        className="text-xs tracking-link text-content-muted hover:text-content-primary transition-colors"
      >
        더 알아보기 &gt;
      </Link>
    </section>
  );
}
