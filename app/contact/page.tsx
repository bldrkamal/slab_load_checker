export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-[hsl(var(--muted-foreground))] mb-4">contact@matrixsection.com</p>
      <a
        href="https://www.linkedin.com/in/samaila-kamal-a79988174/"
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
      >
        LinkedIn
      </a>
    </div>
  )
}


