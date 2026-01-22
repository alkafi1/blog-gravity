import { Eye, Heart, Share2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PostImage = ({
    src,
    alt,
    className = "size-full object-cover",
    fallback
}: {
    src?: string;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
}) => {
    if (!src) {
        return fallback || (
            <div className="size-full flex items-center justify-center text-5xl font-black italic opacity-10 tracking-tighter bg-[#f0f0f0] dark:bg-[#161615]">
                EDITORIAL
            </div>
        );
    }
    return <img src={src} alt={alt} className={className} />;
};

export const FormattedDate = ({ date, className, icon }: { date: string; className?: string; icon?: boolean }) => {
    const formatted = new Date(date).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <span className={className}>
            {icon && <Calendar className="size-3" />} {formatted}
        </span>
    );
};

export const ReadTime = ({ content }: { content: string }) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    return (
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Read Time</span>
            <span className="font-mono font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{minutes} min</span>
        </div>
    );
};

export const EngagementStats = ({ reads, likes }: { reads: number; likes: number }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Engagement</span>
        <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 hover:text-[#f53003] cursor-pointer" title="Reads">
                <Eye className="size-3" /> {reads}
            </span>
            <span className="flex items-center gap-1 hover:text-[#f53003] cursor-pointer" title="Likes">
                <Heart className="size-3" /> {likes}
            </span>
        </div>
    </div>
);

export const UserAvatar = ({ name }: { name?: string }) => (
    <div className="size-10 rounded-full bg-linear-to-tr from-[#f53003] to-[#ff6b00] flex items-center justify-center text-white font-bold">
        {name?.charAt(0)}
    </div>
);

export const ShareWidget = () => (
    <div className="flex justify-center gap-4">
        <Button variant="outline" className="rounded-full px-8 h-12 gap-2 border-[#19140015] hover:border-[#f53003] hover:text-[#f53003] transition-all group">
            <Share2 className="size-4 group-hover:rotate-12 transition-transform" /> Share Article
        </Button>
        <Button variant="outline" className="rounded-full size-12 p-0 border-[#19140015] hover:border-[#f53003] hover:text-[#f53003] transition-all">
            <Heart className="size-4" />
        </Button>
    </div>
);
