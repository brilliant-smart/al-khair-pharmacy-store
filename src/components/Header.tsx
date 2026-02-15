import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Departments", to: "/#departments" },
  { name: "Shop", to: "/#all-products" },
  { name: "Pharmacy", to: "/#pharmacy-highlight" },
  { name: "About", to: "/#about" },
  { name: "Contact", to: "/#contact" },
];

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span className="font-body">+234 706 313 4838</span>
          </div>
          <p className="hidden md:block font-body">Your Trusted Supermarket & Pharmacy in Bauchi</p>
          <span className="font-body text-xs">Licensed & Certified</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                scrollToSection("#hero");
              }
            }}
            className="flex-shrink-0 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col text-left"
            >
              <span className="font-display text-2xl md:text-3xl font-bold text-secondary">
                Al-Khair
              </span>
              <span className="font-body text-xs text-muted-foreground tracking-wider uppercase">
                Pharmacy & Store
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.to}
                  onClick={(e) => {
                    if (isHome && link.to.startsWith("/#")) {
                      e.preventDefault();
                      scrollToSection(link.to.slice(1));
                    }
                  }}
                  className="font-body text-foreground/80 hover:text-primary transition-colors duration-300 relative group block"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "200px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block overflow-hidden"
                >
                  <Input
                    placeholder="Search products..."
                    className="h-9 font-body"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground/70 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground/70 hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body">
                0
              </span>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground/70"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {/* Mobile search */}
              <Input
                placeholder="Search products..."
                className="h-10 font-body"
              />
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => {
                      if (isHome && link.to.startsWith("/#")) {
                        scrollToSection(link.to.slice(1));
                      }
                      setIsMenuOpen(false);
                    }}
                    className="font-body text-foreground/80 hover:text-primary transition-colors block py-2 w-full text-left"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
