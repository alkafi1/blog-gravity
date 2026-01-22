import { Link } from '@inertiajs/react';
import { Eye, Share2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { PostImage } from '@/components/blog/post-helpers';

export default function LayoutSidebarRight({ post }: { post: Post }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-16 animate-in fade-in duration-1000">
            <article className="flex-1 max-w-4xl">
                <header className="mb-12">
                    <span className="text-[#f53003] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">{post.category?.name}</span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">{post.title}</h1>
                    <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl bg-[#f0f0f0] dark:bg-[#161615]">
                        <PostImage src={post.featured_image || post.thumbnail_image} alt={post.title} />
                    </div>
                </header>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {post.content.split('\n').map((p, i) => <p key={i} className="mb-6 opacity-90">{p}</p>)}
                </div>
            </article>

            <aside className="lg:w-80 shrink-0">
                <div className="sticky top-24 space-y-12">
                    <div className="p-8 rounded-3xl bg-linear-to-b from-[#f0f0f0] to-transparent dark:from-[#161615] border border-[#19140010]">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#706f6c] mb-6">Article Info</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center">
                                    <UserIcon className="size-5 text-[#f53003]" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">Author</p>
                                    <p className="text-sm font-bold">{post.user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center">
                                    <Eye className="size-5 text-[#f53003]" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">Reads</p>
                                    <p className="text-sm font-bold font-mono">{post.reads}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#f53003] text-white">
                        <h3 className="font-black italic text-2xl mb-4 tracking-tighter">SHARE THE STORY</h3>
                        <p className="text-sm opacity-90 mb-6">Found this insightful? Pass it on to your circle.</p>
                        <Button className="w-full bg-white text-[#f53003] hover:bg-white/90 rounded-xl font-bold py-6">
                            <Share2 className="mr-2 size-4" /> Share Now
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
