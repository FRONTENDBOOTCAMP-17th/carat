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
      className="max-w-[1440px] mx-auto bg-zinc-950 py-20"
      aria-labelledby="collections-heading"
    >
      <p className="mb-3 text-[10px] tracking-[0.4em] text-zinc-500">
        현대적인 조형성과 정교한 소재가 만나는 곳,
      </p>
      <p className="mb-3 text-[10px] tracking-[0.4em] text-zinc-500">
        PRISME의 컬렉션을 만나보세요.
      </p>

      <h2
        id="collections-heading"
        className="mb-14 text-4xl tracking-[0.25em] text-white"
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
        className="text-xs tracking-[0.3em] text-white/60 hover:text-white transition-colors"
      >
        더 알아보기 &gt;
      </Link>
    </section>
  );
}
