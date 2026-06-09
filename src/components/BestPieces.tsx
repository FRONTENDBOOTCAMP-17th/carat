import ProductCard from "./ProductCard";

export default function BestPieces() {
  return (
    <section className="px-24 py-40">
      <p className="mb-4 text-sm tracking-[0.4em]">
        FEATURED
      </p>

      <h2 className="mb-16 text-6xl font-light">
        BEST PIECES
      </h2>

      <div className="grid grid-cols-3 gap-12">
        <ProductCard
          name="HALO RING"
          category="RING"
          price="$320"
        />

        <ProductCard
          name="AXIS RING"
          category="RING"
          price="$280"
        />

        <ProductCard
          name="PRISM RING"
          category="RING"
          price="$350"
        />
      </div>
    </section>
  );
}