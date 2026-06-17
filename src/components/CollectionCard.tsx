type CollectionCardProps = {
  title: string;
  price: string;
};

export default function CollectionCard({
  title,
  price,
}: CollectionCardProps) {
  return (
    <article className="group cursor-pointer" aria-label={`${title}, ${price}`}>
      <figure className="mb-4 aspect-4/5 bg-surface-elevated" role="img" aria-label={`${title} 컬렉션 이미지`} />
      <p className="mb-1 text-2xs tracking-link text-content-faint">RING</p>
      <h3 className="mb-1 text-sm font-light text-content-primary">{title}</h3>
      <p className="text-sm text-content-faint">{price}</p>
    </article>
  );
}
