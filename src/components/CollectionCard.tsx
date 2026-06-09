type CollectionCardProps = {
  title: string;
  description: string;
};

export default function CollectionCard({
  title,
  description,
}: CollectionCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="mb-6 aspect-[4/5] bg-zinc-200" />

      <h3 className="mb-2 text-2xl font-light">
        {title}
      </h3>

      <p className="text-zinc-600">
        {description}
      </p>
    </article>
  );
}