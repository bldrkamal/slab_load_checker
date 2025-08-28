import Link from "next/link"
import { getAllPosts } from "@/lib/posts"

export const dynamic = "error"

export default function BlogIndexPage() {
  const posts = getAllPosts()
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.length === 0 && <p className="text-gray-600">No posts yet.</p>}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="p-4 rounded-md border">
            <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {post.title}
            </Link>
            <div className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
            {post.author && <div className="text-sm text-gray-500">By {post.author}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}


