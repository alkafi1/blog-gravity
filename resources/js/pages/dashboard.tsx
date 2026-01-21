import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { FileText, FolderTree, Users, CheckCircle2, CircleDashed } from 'lucide-react';

interface Stats {
    users: number;
    categories: number;
    posts: {
        total: number;
        published: number;
        drafts: number;
    };
}

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats }: Props) {
    const publishedPercentage = stats.posts.total > 0
        ? Math.round((stats.posts.published / stats.posts.total) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening on your blog.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#161615] p-6 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] flex items-center gap-4 group transition-all hover:ring-2 hover:ring-blue-500/20">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Users</p>
                            <h2 className="text-2xl font-black">{stats.users}</h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#161615] p-6 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] flex items-center gap-4 group transition-all hover:ring-2 hover:ring-blue-500/20">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <FolderTree className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
                            <h2 className="text-2xl font-black">{stats.categories}</h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#161615] p-6 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] flex items-center gap-4 group transition-all hover:ring-2 hover:ring-blue-500/20">
                        <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Posts</p>
                            <h2 className="text-2xl font-black">{stats.posts.total}</h2>
                        </div>
                    </div>
                </div>

                {/* Content Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#161615] p-8 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Post Status Distribution</h3>
                            <div className="text-xs font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                {publishedPercentage}% Published
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000"
                                    style={{ width: `${publishedPercentage}%` }}
                                />
                                <div
                                    className="h-full bg-amber-400 transition-all duration-1000"
                                    style={{ width: `${100 - publishedPercentage}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#19140015] dark:border-[#3E3E3A]">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Published</p>
                                        <p className="font-bold">{stats.posts.published}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#19140015] dark:border-[#3E3E3A]">
                                    <CircleDashed className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Drafts</p>
                                        <p className="font-bold">{stats.posts.drafts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white flex flex-col justify-between overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2 italic">Quick Insights</h3>
                            <p className="text-blue-100 text-sm leading-relaxed max-w-[280px]">
                                Your most active category is still being calculated. Keep writing to see more detailed analytics!
                            </p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <button className="bg-white text-blue-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                                View Analytics
                            </button>
                        </div>
                        <FileText className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
