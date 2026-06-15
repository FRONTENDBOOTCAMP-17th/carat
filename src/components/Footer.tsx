export default function Footer() {
  return (
    <footer className="max-w-[1440px] mx-auto bg-zinc-950 py-14">
      <nav aria-label="Footer navigation" className="flex gap-24">
        <section aria-labelledby="footer-collections" className="w-fit">
          <h3
            id="footer-collections"
            className="mb-5 text-[10px] tracking-[0.1em] text-white"
          >
            COLLECTIONS
          </h3>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>
              <a
                href="/collections"
                className="hover:text-white transition-colors"
              >
                Essential Collection
              </a>
            </li>
            <li>
              <a
                href="/collections"
                className="hover:text-white transition-colors"
              >
                Featured Pieces
              </a>
            </li>
            <li>
              <a
                href="/collections"
                className="hover:text-white transition-colors"
              >
                All Products
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-explore" className="w-fit">
          <h3
            id="footer-explore"
            className="mb-5 text-[10px] tracking-[0.1em] text-white"
          >
            EXPLORE
          </h3>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Materials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Process
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Archive
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-support" className="w-fit">
          <h3
            id="footer-support"
            className="mb-5 text-[10px] tracking-[0.1em] text-white"
          >
            SUPPORT
          </h3>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping &amp; Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Care Guide
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-contact" className="w-fit">
          <h3
            id="footer-contact"
            className="mb-5 text-[10px] tracking-[0.1em] text-white"
          >
            CONTACT
          </h3>
          <ul className="space-y-3 text-xs text-zinc-500">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                E-mail
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Social Media
              </a>
            </li>
          </ul>
        </section>
      </nav>
    </footer>
  );
}
