import Link from "next/link";

const footerLinks = [
  { label: "About Us", href: "/#about-developer" },
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-foreground/80 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground">TaskFlow</p>
          <nav className="flex flex-wrap gap-4">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>Dhaka, Bangladesh</p>
          <p>Built with ❤️ by Md. Nazmus Sakib</p>
        </div>
      </div>
    </footer>
  );
}
