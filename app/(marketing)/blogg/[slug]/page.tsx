import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/blog-data";
import { Clock, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-[#1C2833] mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-[#1C2833] mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#1C2833]">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#2E86AB] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 text-[#5d6b7a] text-sm">$1</li>')
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/g, '<ul class="space-y-1 my-3 list-disc list-inside">$&</ul>');

  // Process tables: collect consecutive table rows, skip separator lines, wrap in <table>
  html = html.replace(/((?:^\|.+\|\s*\n?)+)/gm, (block) => {
    const rows = block.trim().split("\n").filter((line) => {
      const trimmed = line.trim();
      // Skip separator rows like |---|---|
      return trimmed.startsWith("|") && !/^\|[\s\-|]+\|$/.test(trimmed);
    });
    if (rows.length === 0) return "";
    const tableRows = rows.map((row, i) => {
      const cells = row.split("|").slice(1, -1);
      const tag = i === 0 ? "th" : "td";
      const cellClass = i === 0
        ? 'class="py-2 px-3 text-sm font-semibold text-[#1C2833] bg-[#F4F6F7]"'
        : 'class="py-2 px-3 text-sm text-[#5d6b7a]"';
      return `<tr class="border-b border-[#e5e9ec]">${cells.map((c) => `<${tag} ${cellClass}>${c.trim()}</${tag}>`).join("")}</tr>`;
    });
    return `<div class="overflow-x-auto my-4"><table class="w-full border border-[#e5e9ec] rounded-lg overflow-hidden">${tableRows.join("")}</table></div>`;
  });

  html = html
    .replace(/\n\n/g, '</p><p class="text-[#5d6b7a] text-sm leading-relaxed my-3">')
    .replace(/^(?!<[hultd])(.+)$/gm, '<p class="text-[#5d6b7a] text-sm leading-relaxed my-3">$1</p>');

  return html;
}

export default function BloggArtikelPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/blogg" className="inline-flex items-center gap-2 text-sm text-[#2E86AB] hover:underline">
            <ArrowLeft size={14} aria-hidden="true" />
            Tilbake til blogg
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 text-xs text-[#5d6b7a] mb-3">
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("nb-NO", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}
              </time>
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {post.readingTime} min lesing
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-[#1C2833] leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-[#5d6b7a] text-base leading-relaxed border-l-4 border-[#1B4F72] pl-4">
              {post.excerpt}
            </p>
          </header>

          <div
            className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </article>

        <div className="mt-10 bg-[#1B4F72] rounded-lg p-6 text-white text-center">
          <h2 className="font-semibold text-lg mb-2">Klar til å komme i gang?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Bruk HjemTrygg til å bygge din families beredskapsplan – gratis.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-block bg-white text-[#1B4F72] font-semibold px-6 py-2.5 rounded-md hover:bg-blue-50 transition-colors"
          >
            Start gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
