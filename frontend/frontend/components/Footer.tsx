"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const footerLinks = [
  { label: "About Us", href: "/#about-developer" },
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="border-t border-border bg-background"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-foreground/80 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground">TaskFlow</p>
          <nav className="flex flex-wrap gap-4">
            {footerLinks.map((item) => (
              <motion.div
                key={item.label}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }
                }
                transition={{ duration: 0.16 }}
              >
                <Link href={item.href} className="transition hover:text-accent">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>Dhaka, Bangladesh</p>
          <p>Built with ❤️ by Md. Nazmus Sakib</p>
        </div>
      </div>
    </motion.footer>
  );
}
