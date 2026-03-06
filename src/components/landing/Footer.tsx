const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container">
      <div className="grid sm:grid-cols-4 gap-8">
        <div>
          <div className="mb-3">
            <img src="/logo-shopsmart.png" alt="ShopsMart" style={{ height: '80px', width: 'auto' }} className="object-contain" />
          </div>
          <p className="text-sm text-muted-foreground">Smart retail distribution management for modern brands.</p>
        </div>

        {[
          { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-3 text-foreground">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ShopsMart. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
