import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/DataTable';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCan } from '@/hooks/use-can';

interface Post {
    id: string;
    title: string;
    slug: string;
    category?: { name: string };
    user?: { name: string };
    status: string;
    shares: number;
    likes: number;
    reads: number;
    thumbnail_image?: string;
}

interface Props {
    posts: Post[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/admin/posts' },
];

export default function Index({ posts }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const canCreate = useCan('posts.create');
    const canUpdate = useCan('posts.update') || useCan('posts.update.all');
    const canDelete = useCan('posts.delete') || useCan('posts.delete.all');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openDeleteDialog = (post: Post) => {
        setSelectedPost(post);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedPost) {
            router.delete(`/admin/posts/${selectedPost.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false)
            });
        }
    };

    const columns: Column<Post>[] = [
        {
            header: 'Title',
            accessorKey: 'title',
            sortable: true,
            cell: (row: Post) => <span className="font-bold">{row.title}</span>
        },
        {
            header: 'Category',
            accessorKey: 'category.name',
            sortable: true,
            cell: (row: Post) => <span className="text-sm opacity-80">{row.category?.name || 'Uncategorized'}</span>
        },
        {
            header: 'Author',
            accessorKey: 'user.name',
            sortable: true,
            cell: (row: Post) => <span className="text-sm opacity-60">{row.user?.name}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            sortable: true,
            align: 'center',
            cell: (row: Post) => {
                const colors: Record<string, string> = {
                    published: 'bg-green-100 text-green-700',
                    draft: 'bg-gray-100 text-gray-700',
                    pending: 'bg-blue-100 text-blue-700',
                    rejected: 'bg-red-100 text-red-700',
                    watch: 'bg-purple-100 text-purple-700'
                };
                return (
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${colors[row.status] || 'bg-gray-100'}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            header: 'Stats',
            accessorKey: 'reads',
            sortable: true,
            align: 'center',
            cell: (row: Post) => (
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    <span title="Reads">{row.reads} R</span>
                    <span title="Likes">{row.likes} L</span>
                    <span title="Shares">{row.shares} S</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            align: 'center',
            cell: (row: Post) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        asChild
                    >
                        <Link href={`/blog/${row.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    {canUpdate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            asChild
                        >
                            <Link href={`/admin/posts/${row.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteDialog(row)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ].filter(col => col.header !== 'Actions' || (canUpdate || canDelete));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Management" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                        <p className="text-sm text-muted-foreground">Manage your articles and publications.</p>
                    </div>
                    {canCreate && (
                        <Button asChild className="gap-2">
                            <Link href="/admin/posts/create">
                                <Plus className="h-4 w-4" />
                                Create Post
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid gap-4">
                    <DataTable
                        data={posts}
                        columns={columns}
                        searchKey="title"
                    />
                </div>
            </div>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post
                            <span className="font-bold text-foreground mx-1">"{selectedPost?.title}"</span>
                            and remove it from the public blog.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
