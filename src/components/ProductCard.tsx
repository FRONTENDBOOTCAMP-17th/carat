type ProductCardProps = {
  name: string;
  description?: string;
  category?: string;
  price: string;
};

export default function ProductCard({ name, description, category, price }: ProductCardProps) {
  return (
    <article className="group cursor-pointer" aria-label={`${name}${category ? `, ${category}` : ""}, ${price}`}>
      <figure className="mb-4 aspect-square bg-zinc-700" role="img" aria-label={`${name} 상품 이미지`} />
      {category && (
        <p className="mb-1 text-[10px] tracking-[0.3em] text-zinc-500">{category}</p>
      )}
      <h3 className="mb-0.5 text-sm font-light text-white">{name}</h3>
      {description && (
        <p className="mb-0.5 text-xs text-zinc-500">{description}</p>
      )}
      <p className="text-sm text-white/80">{price}</p>
    </article>
  );
}
