import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Post } from '@/types';
import LayoutStandard from './layouts/layout-standard';
import LayoutSidebarRight from './layouts/layout-sidebar-right';
import LayoutFullWidth from './layouts/layout-full-width';
import LayoutMinimalist from './layouts/layout-minimalist';
import LayoutMagazine from './layouts/layout-magazine';

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
