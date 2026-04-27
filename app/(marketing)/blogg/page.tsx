import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blogg – Beredskapsguider og tips",
  description: "Praktiske guider og råd om hjemmeberedskap for norske familier.",
};

export default function BloggPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[#1C2833] mb-3">Beredskapsguider</h1>
          <p className="text-[#5d6b7a] text-lg">
            Praktiske råd og guider om hjemmeberedskap for norske familier.
          </p>
        </div>
        <div className="space-y-6">
          {sorted.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 hover:border-[#1B4F72] transition-colors group">
              <div className="flex items-center gap-4 text-xs text-[#5d6b7a] mb-3">
                <time dateTime={post.publishedAt}>
                  {new Intl.DateTimeFormat("nb-NO", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}
                </time>
                <span className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  {post.readingTime} min lesing
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#1C2833] mb-2 group-hover:text-[#1B4F72] transition-colors">
                <Link href={`/blogg/${post.slug}`} className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72]">
                  {post.title}
                </Link>
              </h2>
              <p className="text-[#5d6b7a] text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <Link
                href={`/blogg/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4F72] hover:gap-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72]"
                aria-label={`Les mer: ${post.title}`}
              >
                Les artikkelen
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
