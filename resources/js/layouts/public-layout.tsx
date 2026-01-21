import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type SharedData } from '@/types';
import { dashboard, login, register } from '@/routes';

interface Props {
    children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans">
            <header className="border-b border-[#19140015] dark:border-[#3E3E3A] sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                            ANTIGRAVITY<span className="text-[#f53003]">.</span>LOG
                        </Link>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A]">
                            <Link href="/" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] transition-colors">Home</Link>
                            <Link href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] transition-colors">Categories</Link>
                            <Link href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] transition-colors">Trending</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="text-sm font-medium px-4 py-2 rounded-full bg-[#1b1b18] text-white dark:bg-[#EDEDEC] dark:text-[#0a0a0a] hover:opacity-90 transition-opacity"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-medium px-4 py-2 rounded-full bg-[#1b1b18] text-white dark:bg-[#EDEDEC] dark:text-[#0a0a0a] hover:opacity-90 transition-opacity"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-[#19140015] dark:border-[#3E3E3A] mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        © {new Date().getFullYear()} Antigravity Blog. Built with Laravel & React.
                    </p>
                </div>
            </footer>
        </div>
    );
}
