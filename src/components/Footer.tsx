export default function Footer() {
  return (
    <footer className="w-full bg-surface-darkest">
      <nav aria-label="Footer navigation" className="max-w-container mx-auto grid grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:gap-x-6 lg:gap-y-10 lg:px-8 lg:py-14">
        <section aria-labelledby="footer-collections" className="w-fit">
          <h3
            id="footer-collections"
            className="mb-5 text-2xs tracking-label text-content-primary"
          >
            COLLECTIONS
          </h3>
          <ul className="space-y-3 text-xs text-content-dimmed">
            <li>
              <a
                href="/collections"
                className="hover:text-content-primary transition-colors"
              >
                Essential Collection
              </a>
            </li>
            <li>
              <a
                href="/collections"
                className="hover:text-content-primary transition-colors"
              >
                Featured Pieces
              </a>
            </li>
            <li>
              <a
                href="/collections"
                className="hover:text-content-primary transition-colors"
              >
                All Products
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-explore" className="w-fit">
          <h3
            id="footer-explore"
            className="mb-5 text-2xs tracking-label text-content-primary"
          >
            EXPLORE
          </h3>
          <ul className="space-y-3 text-xs text-content-dimmed">
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Materials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Process
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Archive
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-support" className="w-fit">
          <h3
            id="footer-support"
            className="mb-5 text-2xs tracking-label text-content-primary"
          >
            SUPPORT
          </h3>
          <ul className="space-y-3 text-xs text-content-dimmed">
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Shipping &amp; Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Care Guide
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-contact" className="w-fit">
          <h3
            id="footer-contact"
            className="mb-5 text-2xs tracking-label text-content-primary"
          >
            CONTACT
          </h3>
          <ul className="space-y-3 text-xs text-content-dimmed">
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                E-mail
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-content-primary transition-colors">
                Social Media
              </a>
            </li>
          </ul>
        </section>
      </nav>
    </footer>
  );
}
