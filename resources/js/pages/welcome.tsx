import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    posts?: Post[];
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    category?: Category;
    user?: { name: string };
    published_at: string;
    featured_image?: string;
    thumbnail_image?: string;
    reads: number;
    likes: number;
    shares: number;
}

interface Props {
    featuredPost: Post | null;
    categories: Category[];
}

export default function Welcome({ featuredPost, categories }: Props) {
    return (
        <PublicLayout>
            <Head title="Premium Newspaper Blog" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero / Featured Post */}
                {featuredPost && (
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                        <div className="lg:col-span-8 group cursor-pointer">
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <div className="aspect-video bg-[#f0f0f0] dark:bg-[#161615] rounded-2xl overflow-hidden mb-6 relative">
                                    {featuredPost.featured_image ? (
                                        <img
                                            src={featuredPost.featured_image}
                                            alt={featuredPost.title}
                                            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#f53003]/10 flex items-center justify-center text-[#f53003]/20 font-black text-6xl uppercase tracking-tighter">PREMIUM</div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 p-8 text-white">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest bg-[#f53003] px-3 py-1 rounded-full">
                                                {featuredPost.category?.name || 'Featured'}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                                {featuredPost.reads} Reads
                                            </span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 group-hover:underline transition-all">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-lg text-white/80 line-clamp-2 max-w-2xl">
                                            {featuredPost.content}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="lg:col-span-4 flex flex-col justify-center">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f53003] mb-6">Trending Now</h3>
                            <div className="space-y-8">
                                {categories.slice(0, 3).map((cat, idx) => (
                                    cat.posts?.[0] && (
                                        <Link key={cat.id} href={`/blog/${cat.posts[0].slug}`} className="group block">
                                            <span className="text-4xl font-black text-[#19140015] dark:text-[#ffffff10] block mb-1 italic">0{idx + 1}</span>
                                            <h4 className="text-lg font-bold group-hover:text-[#f53003] transition-colors line-clamp-2">
                                                {cat.posts[0].title}
                                            </h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-1 italic">
                                                by {cat.posts[0].user?.name}
                                            </p>
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div className="h-px bg-[#19140015] dark:border-[#3E3E3A] mb-20" />

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {categories.map((category) => (
                        <section key={category.id}>
                            <div className="flex items-center justify-between border-b-2 border-[#1b1b18] dark:border-[#EDEDEC] pb-2 mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tighter">{category.name}</h3>
                                <Link href="#" className="text-xs font-bold text-[#f53003] hover:underline">VIEW ALL</Link>
                            </div>

                            <div className="space-y-10">
                                {category.posts?.map((post, idx) => (
                                    <article key={post.id} className={`${idx === 0 ? 'block' : 'flex gap-4'}`}>
                                        {idx === 0 ? (
                                            <>
                                                <div className="aspect-4/3 bg-[#f0f0f0] dark:bg-[#161615] rounded-xl mb-4 overflow-hidden relative group/img">
                                                    {post.featured_image ? (
                                                        <img
                                                            src={post.featured_image}
                                                            alt={post.title}
                                                            className="absolute inset-0 size-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
                                                    )}
                                                </div>
                                                <Link href={`/blog/${post.slug}`} className="group">
                                                    <h4 className="text-xl font-bold group-hover:text-[#f53003] transition-colors mb-2">
                                                        {post.title}
                                                    </h4>
                                                </Link>
                                                <div className="flex items-center gap-3 mb-2 text-[10px] uppercase font-bold tracking-widest text-[#706f6c] dark:text-[#A1A09A]">
                                                    <span>{post.reads} Reads</span>
                                                    <span>•</span>
                                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] line-clamp-3">
                                                    {post.content}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 shrink-0 bg-[#f0f0f0] dark:bg-[#161615] rounded-lg overflow-hidden">
                                                    {post.thumbnail_image ? (
                                                        <img src={post.thumbnail_image} alt={post.title} className="size-full object-cover" />
                                                    ) : (
                                                        <div className="size-full bg-gray-200 dark:bg-gray-800" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Link href={`/blog/${post.slug}`} className="group">
                                                        <h4 className="text-md font-bold group-hover:text-[#f53003] transition-colors leading-tight">
                                                            {post.title}
                                                        </h4>
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-[#706f6c] dark:text-[#A1A09A] font-bold">
                                                            {post.reads} R
                                                        </span>
                                                        <span className="text-[10px] text-[#706f6c] dark:text-[#A1A09A] uppercase font-bold tracking-wider">
                                                            {new Date(post.published_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
