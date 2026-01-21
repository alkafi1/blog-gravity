import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Eye, Heart, Share2, Calendar, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    layout_type: number;
    category?: Category;
    user?: { name: string };
    published_at: string;
    featured_image?: string;
    thumbnail_image?: string;
    share_image?: string;
    reads: number;
    likes: number;
    shares: number;
}

interface Props {
    post: Post;
}

export default function Show({ post }: Props) {
    const renderLayout = () => {
        switch (post.layout_type) {
            case 2: return <LayoutSidebarRight post={post} />;
            case 3: return <LayoutFullWidth post={post} />;
            case 4: return <LayoutMinimalist post={post} />;
            case 5: return <LayoutMagazine post={post} />;
            default: return <LayoutStandard post={post} />;
        }
    };

    return (
        <PublicLayout>
            <Head title={post.title}>
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.content.substring(0, 160)} />
                {post.share_image && <meta property="og:image" content={post.share_image} />}
                {!post.share_image && post.featured_image && <meta property="og:image" content={post.featured_image} />}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            {renderLayout()}
        </PublicLayout>
    );
}

const LayoutStandard = ({ post }: { post: Post }) => (
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
                    <div className="size-10 rounded-full bg-linear-to-tr from-[#f53003] to-[#ff6b00] flex items-center justify-center text-white font-bold">
                        {post.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{post.user?.name}</p>
                        <p className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="size-3" /> {new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 border-l border-[#19140015] pl-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Read Time</span>
                        <span className="font-mono font-bold text-[#1b1b18] dark:text-[#EDEDEC]">5 min</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Engagement</span>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 hover:text-[#f53003] cursor-pointer"><Eye className="size-3" /> {post.reads}</span>
                            <span className="flex items-center gap-1 hover:text-[#f53003] cursor-pointer"><Heart className="size-3" /> {post.likes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="aspect-[21/10] bg-[#f0f0f0] dark:bg-[#161615] rounded-[2rem] mb-16 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group">
            {post.featured_image ? (
                <img src={post.featured_image} alt={post.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
            ) : (
                <div className="size-full flex items-center justify-center text-5xl font-black italic opacity-10 tracking-tighter">EDITORIAL</div>
            )}
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
                <div className="flex justify-center gap-4">
                    <Button variant="outline" className="rounded-full px-8 h-12 gap-2 border-[#19140015] hover:border-[#f53003] hover:text-[#f53003] transition-all group">
                        <Share2 className="size-4 group-hover:rotate-12 transition-transform" /> Share Article
                    </Button>
                    <Button variant="outline" className="rounded-full size-12 p-0 border-[#19140015] hover:border-[#f53003] hover:text-[#f53003] transition-all">
                        <Heart className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    </article>
);

const LayoutSidebarRight = ({ post }: { post: Post }) => (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-16 animate-in fade-in duration-1000">
        <article className="flex-1 max-w-4xl">
            <header className="mb-12">
                <span className="text-[#f53003] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">{post.category?.name}</span>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">{post.title}</h1>
                <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
                    <img src={post.featured_image || '/placeholder.jpg'} className="size-full object-cover" />
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

const LayoutFullWidth = ({ post }: { post: Post }) => (
    <article className="animate-in fade-in duration-1000">
        <div className="h-[90vh] relative flex items-end overflow-hidden group">
            {post.featured_image ? (
                <img src={post.featured_image} className="absolute inset-0 size-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out" />
            ) : (
                <div className="absolute inset-0 bg-[#1b1b18]" />
            )}
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

const LayoutMinimalist = ({ post }: { post: Post }) => (
    <article className="max-w-3xl mx-auto px-4 py-40 animate-in fade-in duration-[2s]">
        <header className="mb-32 text-center">
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#706f6c] mb-12 flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-[#19140015]" />
                {new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                <div className="h-px w-8 bg-[#19140015]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12 leading-tight italic font-serif">
                {post.title}
            </h1>
            <div className="size-1 bg-[#f53003] mx-auto rounded-full" />
        </header>

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

const LayoutMagazine = ({ post }: { post: Post }) => (
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
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <img src={post.featured_image || '/placeholder.jpg'} className="size-full object-cover" />
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
