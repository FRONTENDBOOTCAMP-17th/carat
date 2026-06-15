type CollectionCardProps = {
  title: string;
  description: string;
  price: string;
};

export default function CollectionCard({
  title,
  description,
  price,
}: CollectionCardProps) {
  return (
    <article className="group cursor-pointer" aria-label={`${title}, ${price}`}>
      <figure className="mb-4 aspect-4/5 bg-zinc-800" role="img" aria-label={`${title} 컬렉션 이미지`} />
      <p className="mb-1 text-[10px] tracking-[0.3em] text-zinc-500">RING</p>
      <h3 className="mb-1 text-sm font-light text-white">{title}</h3>
      <p className="mb-1 text-xs text-zinc-500">{description}</p>
      <p className="text-sm text-zinc-400">{price}</p>
    </article>
  );
}
