import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface PostMeta {
  title: string
  date: string
  author?: string
  slug: string
}

export interface Post extends PostMeta {
  content: string
}

const postsDirectory = path.join(process.cwd(), "content", "posts")

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []
  const files = fs.readdirSync(postsDirectory)
  const posts: PostMeta[] = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const fullPath = path.join(postsDirectory, file)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)
      return {
        title: data.title || file.replace(/\.(md|mdx)$/i, ""),
        date: data.date || new Date().toISOString(),
        author: data.author || "",
        slug: data.slug || file.replace(/\.(md|mdx)$/i, ""),
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  return posts
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) return null
  // Try filename-based resolution first
  const candidates = [
    path.join(postsDirectory, `${slug}.md`),
    path.join(postsDirectory, `${slug}.mdx`),
  ]
  let fullPath = candidates.find((p) => fs.existsSync(p))
  if (!fullPath) {
    // Fallback: scan all files and match frontmatter slug
    const files = fs
      .readdirSync(postsDirectory)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    for (const file of files) {
      const p = path.join(postsDirectory, file)
      const raw = fs.readFileSync(p, "utf8")
      const { data } = matter(raw)
      if (data?.slug === slug) {
        fullPath = p
        break
      }
    }
  }
  if (!fullPath) return null
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  const post: Post = {
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    author: data.author || "",
    slug: data.slug || slug,
    content,
  }
  return post
}


