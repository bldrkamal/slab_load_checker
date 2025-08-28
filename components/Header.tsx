"use client"

import Link from 'next/link';
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-sidebar border-b border-[hsl(var(--border))] p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-sidebar-foreground tracking-tight">Matrix Section</Link>
        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6 text-sm">
          <Link href="/calculators" className="text-sidebar-foreground hover:opacity-80">Calculators</Link>
          <Link href="/blog" className="text-sidebar-foreground hover:opacity-80">Blog</Link>
          <Link href="/about" className="text-sidebar-foreground hover:opacity-80">About</Link>
          <Link href="/contact" className="text-sidebar-foreground hover:opacity-80">Contact</Link>
        </div>
        {/* Mobile menu button */}
        <button
          aria-label="Toggle navigation"
          className="md:hidden text-sidebar-foreground p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden container mx-auto pt-2">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] divide-y">
            <Link href="/calculators" className="block px-4 py-3 hover:opacity-80" onClick={() => setOpen(false)}>Calculators</Link>
            <Link href="/blog" className="block px-4 py-3 hover:opacity-80" onClick={() => setOpen(false)}>Blog</Link>
            <Link href="/about" className="block px-4 py-3 hover:opacity-80" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block px-4 py-3 hover:opacity-80" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
