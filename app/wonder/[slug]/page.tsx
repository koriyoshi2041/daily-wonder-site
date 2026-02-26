import { getAllWonders, getWonderBySlug } from '@/lib/wonders';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';

// 为 Next.js 静态生成 (SSG) 提供所有可能的 slug
export async function generateStaticParams() {
  const wonders = await getAllWonders();
  return wonders.map((wonder) => ({
    slug: wonder.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function WonderPage({ params }: PageProps) {
  const wonder = await getWonderBySlug(params.slug);

  return (
    <>
      <MotionWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="w-full max-w-3xl"
      >
        <header className="text-center mb-12">
          <p className="text-base text-zinc-500">{wonder.date}</p>
          {wonder.title && (
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mt-2">
              {wonder.title}
            </h1>
          )}
        </header>

        <article
          className="prose prose-lg mx-auto"
          dangerouslySetInnerHTML={{ __html: wonder.contentHtml }}
        />
      </MotionWrapper>
      <footer className="absolute bottom-8 text-center">
         <Link href="/"
           className="text-sm text-zinc-400 hover:text-zinc-800 transition-colors duration-300">
            ← Back to Home
        </Link>
      </footer>
    </>
  );
}
