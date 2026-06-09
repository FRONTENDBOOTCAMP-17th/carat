import CollectionCard from "./CollectionCard";

export default function Collections() {
  return (
    <section className="px-24 py-40">
      <p className="mb-4 text-sm tracking-[0.4em]">
        COLLECTIONS
      </p>

      <h2 className="mb-16 text-6xl font-light">
        EXPLORE
      </h2>

      <div className="grid grid-cols-3 gap-12">
        <CollectionCard
          title="ESSENTIAL"
          description="The foundation of the PRISME collection."
        />

        <CollectionCard
          title="BALANCE"
          description="A study in proportion and restraint."
        />

        <CollectionCard
          title="FORM"
          description="Defined by silhouette and structure."
        />
      </div>
    </section>
  );
}