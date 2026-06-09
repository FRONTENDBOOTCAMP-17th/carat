type ProductCardProps = {
  name: string;
  category: string;
  price: string;
};

export default function ProductCard({
  name,
  category,
  price,
}: ProductCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="mb-4 aspect-square bg-zinc-200" />

      <p className="mb-2 text-xs tracking-[0.3em] text-zinc-500">
        {category}
      </p>

      <h3 className="mb-1 text-xl">{name}</h3>

      <p className="text-zinc-600">{price}</p>
    </article>
  );
}