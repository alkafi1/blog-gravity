import { Post } from '@/types';
import { FormattedDate, PostImage } from '@/components/blog/post-helpers';

export default function LayoutMinimalist({ post }: { post: Post }) {
    return (
        <article className="max-w-3xl mx-auto px-4 py-40 animate-in fade-in duration-[2s]">
            <header className="mb-32 text-center">
                <div className="text-[10px] uppercase tracking-[0.5em] text-[#706f6c] mb-12 flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-[#19140015]" />
                    <FormattedDate date={post.published_at} />
                    <div className="h-px w-8 bg-[#19140015]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12 leading-tight italic font-serif">
                    {post.title}
                </h1>
                <div className="size-1 bg-[#f53003] mx-auto rounded-full" />
            </header>

            {/* Minimalist Image Addition */}
            {(post.featured_image || post.thumbnail_image) && (
                <div className="mb-24 aspect-[21/9] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                    <PostImage src={post.featured_image || post.thumbnail_image} alt={post.title} />
                </div>
            )}

            <div className="prose dark:prose-invert max-w-2xl mx-auto prose-p:mb-12 prose-p:text-lg prose-p:leading-[2] prose-p:opacity-80 font-serif">
                {post.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <footer className="mt-40 border-t border-[#19140010] pt-12 flex flex-col items-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#706f6c] mb-8">FIN.</p>
                <div className="flex gap-12 text-[#706f6c] dark:text-[#A1A09A]">
                    <button className="text-[10px] uppercase tracking-widest hover:text-[#f53003] transition-colors">Share</button>
                    <button className="text-[10px] uppercase tracking-widest hover:text-[#f53003] transition-colors">Bookmark</button>
                    <button className="text-[10px] uppercase tracking-widest hover:text-[#f53003] transition-colors">Applaud</button>
                </div>
            </footer>
        </article>
    );
}
