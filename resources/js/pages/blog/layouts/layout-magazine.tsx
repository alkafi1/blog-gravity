import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { PostImage } from '@/components/blog/post-helpers';

export default function LayoutMagazine({ post }: { post: Post }) {
    return (
        <div className="max-w-[1600px] mx-auto px-4 py-12 animate-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-8 border-black dark:border-white">
                <div className="lg:col-span-8 p-12 border-b-8 lg:border-b-0 lg:border-r-8 border-black dark:border-white">
                    <div className="flex justify-between items-start mb-12">
                        <span className="text-[12px] font-black uppercase tracking-tighter bg-black text-white dark:bg-white dark:text-black px-4 py-1">
                            Issue No. 042 // {post.category?.name}
                        </span>
                        <span className="text-[12px] font-black uppercase">{new Date(post.published_at).getFullYear()}</span>
                    </div>

                    <h1 className="text-[10vw] lg:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase mb-12 break-words">
                        {post.title}
                    </h1>

                    <div className="flex gap-8 items-center mb-12 py-6 border-y-2 border-black dark:border-white">
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest">Written By</p>
                            <p className="text-2xl font-black italic tracking-tighter">{post.user?.name}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="size-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-black">
                                {post.reads}
                            </div>
                        </div>
                    </div>

                    <div className="columns-1 md:columns-2 gap-12 text-lg leading-relaxed font-medium uppercase tracking-tight text-justify">
                        {post.content.split('\n').map((p, i) => <p key={i} className="mb-8">{p}</p>)}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-black dark:bg-white text-white dark:text-black p-12 flex flex-col justify-between">
                    <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 bg-white/10">
                        <PostImage src={post.featured_image || post.thumbnail_image} alt={post.title} />
                    </div>

                    <div className="mt-12">
                        <h3 className="text-5xl font-black tracking-tighter mb-8 leading-none uppercase">Aesthetic <br /> Revolution</h3>
                        <div className="space-y-4">
                            <Button className="w-full h-16 bg-white text-black dark:bg-black dark:text-white rounded-none font-black uppercase tracking-widest text-xl hover:invert transition-all">
                                Spread IT
                            </Button>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pt-4">
                                <span>The Newspaper</span>
                                <span>Est. 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
