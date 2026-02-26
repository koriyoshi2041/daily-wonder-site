import Link from 'next/link';
import { getAllWonders } from '@/lib/wonders';
import MotionWrapper from '@/components/MotionWrapper';

export default async function HomePage() {
  const allWonders = await getAllWonders();
  
  if (!allWonders || allWonders.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold">No wonders found.</h1>
        <p className="mt-2 text-zinc-600">Please check the directory `~/clawd/memory/daily-wonders/`.</p>
      </div>
    );
  }

  const latestWonder = allWonders[0];

  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full max-w-2xl text-center"
    >
      <header className="mb-8">
        <p className="text-sm text-zinc-500">{latestWonder.date}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
          {latestWonder.title || 'Daily Wonder'}
        </h1>
      </header>
      
      <article
        className="prose mx-auto text-left"
        dangerouslySetInnerHTML={{ __html: latestWonder.contentHtml }}
      />
      
      <footer className="mt-12">
        <Link href={`/wonder/${latestWonder.slug}`}
           className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors duration-300">
            View this wonder →
        </Link>
        {allWonders.length > 1 && (
          <div className="mt-4">
            <p className="text-xs text-zinc-400 mb-2">Previous wonders:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {allWonders.slice(1, 6).map((wonder) => (
                <Link 
                  key={wonder.slug}
                  href={`/wonder/${wonder.slug}`}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {wonder.date}
                </Link>
              ))}
            </div>
          </div>
        )}
      </footer>
    </MotionWrapper>
  );
}
