type ProductCardProps = {
  name: string;
  description?: string;
  category?: string;
  price: string;
};

export default function ProductCard({ name, description, category, price }: ProductCardProps) {
  return (
    <article className="group cursor-pointer" aria-label={`${name}${category ? `, ${category}` : ""}, ${price}`}>
      <figure className="mb-4 aspect-square bg-surface-input" role="img" aria-label={`${name} 상품 이미지`} />
      {category && (
        <p className="mb-1 text-2xs tracking-link text-content-faint">{category}</p>
      )}
      <h3 className="mb-0.5 text-sm font-light text-content-primary">{name}</h3>
      {description && (
        <p className="mb-0.5 text-xs text-content-faint">{description}</p>
      )}
      <p className="text-sm text-content-secondary">{price}</p>
    </article>
  );
}
