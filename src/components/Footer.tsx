import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

const departments = [
  { name: "Superstore", href: "#departments" },
  { name: "Pharmacy", href: "#pharmacy" },
  { name: "Electronics & Kitchen", href: "#departments" },
  { name: "Textiles & Materials", href: "#departments" },
  { name: "Baby Care", href: "#departments" },
];

const quickLinks = [
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
  { name: "Our Products", href: "#products" },
  { name: "Departments", href: "#departments" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div>
            <div className="mb-6">
              <span className="font-display text-2xl font-bold">Al-Khair</span>
              <p className="font-body text-xs text-secondary-foreground/70 tracking-wider uppercase">
                Pharmacy & Store
              </p>
            </div>
            <p className="font-body text-secondary-foreground/80 mb-6 leading-relaxed">
              Built on a legacy of retail expertise, Al-Khair unites trusted
              businesses under one modern destination. We provide high-quality
              products, authentic medications, cutting-edge technology, and
              dependable service, bringing convenience, care, and confidence to
              families across Bauchi.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Departments column */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Departments
            </h4>
            <ul className="space-y-3">
              {departments.map((dept) => (
                <li key={dept.name}>
                  <button
                    onClick={() => scrollToSection(dept.href)}
                    className="font-body text-secondary-foreground/70 hover:text-primary transition-colors text-left"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-body text-secondary-foreground/70 hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-body text-secondary-foreground/80">
                  Bauchi, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-body text-secondary-foreground/80">
                  +234 706 313 4838
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-body text-secondary-foreground/80">
                  info@alkhairstore.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="font-body text-secondary-foreground/80">
                  <p>Everyday: 8:00 AM - 10:00 PM</p>
                  <p>Ready to serve you with care</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Al-Khair Pharmacy & Store. All rights
              reserved.
            </p>
            <p className="font-body text-sm text-secondary-foreground/60">
              Licensed Pharmacy • Quality Guaranteed • Trusted Since 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
