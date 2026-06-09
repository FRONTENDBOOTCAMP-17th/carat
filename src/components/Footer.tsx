export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-24 py-20">
      <div className="grid grid-cols-4 gap-12">
        <div>
          <h3 className="mb-6 text-sm tracking-[0.3em]">
            PRISME
          </h3>

          <p className="text-zinc-600">
            Contemporary jewelry shaped by
            balance, form and light.
          </p>
        </div>

        <div>
          <h3 className="mb-6 text-sm tracking-[0.3em]">
            COLLECTIONS
          </h3>

          <ul className="space-y-2 text-zinc-600">
            <li>Essential</li>
            <li>Balance</li>
            <li>Form</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm tracking-[0.3em]">
            COMPANY
          </h3>

          <ul className="space-y-2 text-zinc-600">
            <li>About</li>
            <li>Journal</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm tracking-[0.3em]">
            FOLLOW
          </h3>

          <ul className="space-y-2 text-zinc-600">
            <li>Instagram</li>
            <li>Pinterest</li>
            <li>Behance</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}