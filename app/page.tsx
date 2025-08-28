import Link from "next/link"
import { getAllPosts } from "@/lib/posts"

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  return (
    <div className="min-h-screen">
      <section className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Fast structural calculators</h1>
          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mb-6">
            Validate slab and beam loads in seconds. Visualize tributary areas. Explore quick references and practical tips.
          </p>
          <div className="space-x-3">
            <Link href="/calculators" className="inline-block bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium px-5 py-2 rounded-md hover:opacity-95">Explore Calculators</Link>
            <Link href="/blog" className="inline-block border border-[hsl(var(--border))] px-5 py-2 rounded-md hover-lift">Read the Blog</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold mb-4 uppercase tracking-wide">Featured calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/calculators/tributary" className="block p-5 border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))] hover:border-[hsl(var(--primary))] transition-colors cursor-pointer hover-lift">
            <h3 className="text-lg font-semibold">Tributary Area</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Detect slab type, visualize, and get UDLs.</p>
          </Link>
          <Link href="/calculators/beam" className="block p-5 border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))] hover:border-[hsl(var(--primary))] transition-colors cursor-pointer hover-lift">
            <h3 className="text-lg font-semibold">Beam (Simply Supported)</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Reactions, shear, and moment for UDL/point loads.</p>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold uppercase tracking-wide">Latest from the blog</h2>
          <Link href="/blog" className="hover:opacity-80">All posts</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block p-5 border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))] hover:border-[hsl(var(--primary))] transition-colors cursor-pointer hover-lift">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">{new Date(p.date).toLocaleDateString()}</div>
              <h3 className="text-lg font-semibold mt-1">{p.title}</h3>
              {p.author && <div className="text-sm text-[hsl(var(--muted-foreground))]">By {p.author}</div>}
            </Link>
          ))}
          {posts.length === 0 && <div className="text-[hsl(var(--muted-foreground))]">No posts yet.</div>}
        </div>
      </section>
    </div>
  )
}
