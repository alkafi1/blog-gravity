import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Post } from '@/types';
import {
    PostImage,
    FormattedDate,
    ReadTime,
    EngagementStats,
    UserAvatar,
    ShareWidget
} from '@/components/blog/post-helpers';

export default function LayoutStandard({ post }: { post: Post }) {
    return (
        <article className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-12">
                <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-[#706f6c] hover:text-[#f53003] transition-colors mb-8">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Feed
                </Link>
                <span className="inline-block px-3 py-1 rounded-full bg-[#f5300310] text-[#f53003] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    {post.category?.name}
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                    {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    <div className="flex items-center gap-3">
                        <UserAvatar name={post.user?.name} />
                        <div>
                            <p className="font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{post.user?.name}</p>
                            <FormattedDate date={post.published_at} className="text-[10px] uppercase tracking-wider flex items-center gap-1" icon />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 border-l border-[#19140015] pl-6">
                        <ReadTime content={post.content} />
                        <EngagementStats reads={post.reads} likes={post.likes} />
                    </div>
                </div>
            </div>

            <div className="aspect-[21/10] bg-[#f0f0f0] dark:bg-[#161615] rounded-[2rem] mb-16 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group">
                <PostImage src={post.featured_image || post.thumbnail_image} alt={post.title} className="group-hover:scale-105 transition-transform duration-[2s] ease-out" />
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="prose prose-xl dark:prose-invert prose-p:leading-relaxed prose-p:text-[#1b1b18/90] dark:prose-p:text-[#EDEDEC/90] first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-[#f53003] selection:bg-[#f5300330]">
                    {post.content.split('\n').map((p, i) => (
                        <p key={i} className="mb-8 text-xl opacity-95">
                            {p}
                        </p>
                    ))}
                </div>

                <div className="mt-20 pt-12 border-t border-[#19140015] dark:border-[#3E3E3A]">
                    <h4 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-center text-[#706f6c]">Spread the Word</h4>
                    <ShareWidget />
                </div>
            </div>
        </article>
    );
}
