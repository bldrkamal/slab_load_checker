import Link from "next/link"

export default function CalculatorsHubPage() {
  const calculators = [
    {
      slug: "/calculators/tributary",
      title: "Tributary Area",
      description: "Find slab tributary areas and beam UDLs with visualization.",
    },
    {
      slug: "/calculators/beam",
      title: "Beam (Simply Supported)",
      description: "Reactions, shear, and moment for UDL or point load.",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 uppercase tracking-wide">Calculators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((c) => (
          <Link key={c.slug} href={c.slug} className="block border border-[hsl(var(--border))] p-5 bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))] hover:border-[hsl(var(--primary))] transition-colors hover-lift">
            <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}


