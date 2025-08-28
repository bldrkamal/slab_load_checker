import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { getAllPosts, getPostBySlug } from "@/lib/posts"

interface Params {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: Params) {
  const p = await params
  const post = getPostBySlug(p.slug)
  if (!post) return notFound()
  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
      {post.author && <p className="text-sm text-gray-500">By {post.author}</p>}
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  )
}


