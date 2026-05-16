import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import { Callout } from './Callout';

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-6 mt-10 font-display text-3xl font-bold tracking-tight text-ink first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mb-4 mt-10 border-b-2 border-ink pb-2 font-display text-2xl font-bold text-ink scroll-mt-24"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mb-3 mt-8 font-display text-xl font-bold text-ink scroll-mt-24"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-ash-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 space-y-2 pl-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-ash-700">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2 leading-relaxed text-ash-700">
      <span className="mt-1.5 h-2 w-2 shrink-0 border-2 border-ink bg-peach-300" aria-hidden />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-peach-300 bg-peach-300/20 px-6 py-4 font-display text-lg font-semibold italic text-ink">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-none border border-ash-300 bg-ash-300/30 px-1.5 py-0.5 font-mono text-[13px] text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto border-2 border-ink bg-navy-900 p-4 font-mono text-sm text-sky-100">
      {children}
    </pre>
  ),
  a: ({ children, href }) => {
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline underline-offset-2 hover:text-ink"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? '#'}
        className="text-blue-500 underline underline-offset-2 hover:text-ink"
      >
        {children}
      </Link>
    );
  },
  img: ({ src, alt }) => {
    if (!src) return null;
    return (
      <figure className="my-8">
        <div className="relative aspect-video w-full border-2 border-ink">
          <Image
            src={src}
            alt={alt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        {alt && (
          <figcaption className="mt-2 text-center font-mono text-[11px] text-ash-700">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: () => <hr className="my-8 border-t-2 border-ink" />,
  strong: ({ children }) => (
    <strong className="font-bold text-ink">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto border-2 border-ink">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b-2 border-ink bg-ink px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-paper">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-ash-300 px-4 py-2 text-ash-700">{children}</td>
  ),
  Callout,
};
