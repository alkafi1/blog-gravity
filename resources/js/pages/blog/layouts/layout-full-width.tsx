import { Link } from '@inertiajs/react';
import { ArrowLeft, Eye, Share2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { PostImage } from '@/components/blog/post-helpers';

export default function LayoutFullWidth({ post }: { post: Post }) {
    return (
        <article className="animate-in fade-in duration-1000">
            <div className="h-[90vh] relative flex items-end overflow-hidden group bg-[#1b1b18]">
                <PostImage
                    src={post.featured_image || post.thumbnail_image}
                    alt={post.title}
                    className="absolute inset-0 size-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out"
                    fallback={<div className="absolute inset-0 bg-[#1b1b18]" />}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-4 py-32 w-full">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#f53003] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-2xl">
                        {post.category?.name}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter max-w-5xl leading-[0.9] drop-shadow-2xl">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-8 mt-12 text-white/80 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <UserIcon className="size-4 text-[#f53003]" /> {post.user?.name}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <Eye className="size-4 text-[#f53003]" /> {post.reads} READS
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-24">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#f53003] mb-12 uppercase tracking-widest hover:translate-x-[-10px] transition-transform">
                    <ArrowLeft className="size-4" /> Editorial Feed
                </Link>
                <div className="prose prose-2xl dark:prose-invert max-w-none font-serif leading-relaxed text-[#1b1b18] dark:text-[#EDEDEC] opacity-80">
                    {post.content.split('\n').map((p, i) => <p key={i} className="mb-10">{p}</p>)}
                </div>

                <div className="mt-24 p-12 rounded-[35px] border-4 border-[#f53003] flex flex-col items-center text-center">
                    <Share2 className="size-12 text-[#f53003] mb-6" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">This vision belongs to the world</h2>
                    <p className="text-[#706f6c] dark:text-[#A1A09A] max-w-md mb-8">If this story moved you, share it with those who appreciate fine perspectives.</p>
                    <div className="flex gap-4">
                        <Button className="bg-[#f53003] hover:bg-[#d42a02] rounded-full px-12 h-14 font-bold text-lg">SHARE POWER</Button>
                    </div>
                </div>
            </div>
        </article>
    );
}
