import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-sidebar p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-sidebar-foreground">Matrix Section</Link>
        <div className="space-x-4">
          <Link href="/blog">
            <Button variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent">Blog</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
