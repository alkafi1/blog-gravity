import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
}

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    category_id: string | null;
    subcategory_id: string | null;
    layout_type: number;
    status: string;
    featured_image: string | null;
    thumbnail_image: string | null;
    share_image: string | null;
}

interface Props {
    post: Post;
    categories: Category[];
    subcategories: Subcategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/admin/posts' },
    { title: 'Edit', href: '#' },
];

export default function Edit({ post, categories, subcategories }: Props) {
    const { data, setData, post: postForm, processing, errors } = useForm({
        _method: 'PUT',
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        category_id: post.category_id || '',
        subcategory_id: post.subcategory_id || '',
        layout_type: post.layout_type || 1,
        featured_image: null as File | null,
        thumbnail_image: null as File | null,
        share_image: null as File | null,
        status: post.status || 'draft',
    });

    const filteredSubcategories = subcategories.filter(sub => sub.category_id === data.category_id);

    const [previews, setPreviews] = useState<{ featured: string | null; thumb: string | null; share: string | null }>({
        featured: post.featured_image,
        thumb: post.thumbnail_image,
        share: post.share_image
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'featured_image' | 'thumbnail_image' | 'share_image') => {
        const file = e.target.files?.[0] || null;
        setData(field as any, file);
        if (file) {
            const url = URL.createObjectURL(file);
            const previewKey = field === 'featured_image' ? 'featured' : (field === 'thumbnail_image' ? 'thumb' : 'share');
            setPreviews(prev => ({ ...prev, [previewKey]: url }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postForm(`/admin/posts/${post.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Post: ${post.title}`} />
            <div className="max-w-4xl p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-[#161615] p-8 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Edit Post</h1>
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`h-2 w-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                                    {post.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1"
                                placeholder="Enter article title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className="mt-1"
                                placeholder="article-slug"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={data.category_id || ''}
                                    onChange={(e) => {
                                        setData(prev => ({ ...prev, category_id: e.target.value, subcategory_id: '' }));
                                    }}
                                    className="w-full mt-1 rounded-md border border-[#19140015] dark:border-[#3E3E3A] bg-transparent p-2"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="subcategory">Subcategory</Label>
                                <select
                                    id="subcategory"
                                    value={data.subcategory_id || ''}
                                    onChange={(e) => setData('subcategory_id', e.target.value)}
                                    className="w-full mt-1 rounded-md border border-[#19140015] dark:border-[#3E3E3A] bg-transparent p-2"
                                    disabled={!data.category_id}
                                >
                                    <option value="">Select Subcategory</option>
                                    {filteredSubcategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                                {errors.subcategory_id && <p className="text-red-500 text-xs mt-1">{errors.subcategory_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="featured_image">Featured Image (Cover)</Label>
                                <div className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#19140015] dark:border-[#3E3E3A] rounded-xl hover:border-[#f53003] transition-colors cursor-pointer relative overflow-hidden group min-h-[160px]">
                                    {previews.featured ? (
                                        <img src={previews.featured} className="absolute inset-0 size-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">Click to upload cover image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="featured_image"
                                        onChange={(e) => handleFileChange(e, 'featured_image')}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail_image">Thumbnail Image (Grid)</Label>
                                <div className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#19140015] dark:border-[#3E3E3A] rounded-xl hover:border-[#f53003] transition-colors cursor-pointer relative overflow-hidden group min-h-[160px]">
                                    {previews.thumb ? (
                                        <img src={previews.thumb} className="absolute inset-0 size-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">Click to upload thumbnail</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="thumbnail_image"
                                        onChange={(e) => handleFileChange(e, 'thumbnail_image')}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                {errors.thumbnail_image && <p className="text-red-500 text-xs mt-1">{errors.thumbnail_image}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="share_image">Social Share Image (1200x630 - Aesthetic View)</Label>
                            <div className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#19140015] dark:border-[#3E3E3A] rounded-xl hover:border-[#f53003] transition-colors cursor-pointer relative overflow-hidden group min-h-[140px]">
                                {previews.share ? (
                                    <img src={previews.share} className="absolute inset-0 size-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Click to upload social share image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="share_image"
                                    onChange={(e) => handleFileChange(e, 'share_image')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                            {errors.share_image && <p className="text-red-500 text-xs mt-1">{errors.share_image}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="layout">Layout Type (1-5)</Label>
                                <Input
                                    type="number"
                                    id="layout"
                                    value={data.layout_type}
                                    onChange={(e) => setData('layout_type', parseInt(e.target.value))}
                                    min={1}
                                    max={5}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Post Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full mt-1 rounded-md border border-[#19140015] dark:border-[#3E3E3A] bg-transparent p-2"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="watch">Watch</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="content">Content</Label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full mt-1 min-h-[400px] rounded-md border border-[#19140015] dark:border-[#3E3E3A] bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-[#f53003] font-mono text-sm"
                                placeholder="Write your article here..."
                            />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.get('/admin/posts')}>Cancel</Button>
                        <Button type="submit" disabled={processing} className="bg-[#f53003] hover:bg-[#d42a02]">Update Post</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
