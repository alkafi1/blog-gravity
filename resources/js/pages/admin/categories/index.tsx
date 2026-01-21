import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/DataTable';
import { DialogModal } from '@/components/DialogModal';
import { CategoryForm } from '@/components/CategoryForm';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
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

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

export default function Index({ categories }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const canCreate = useCan('categories.create');
    const canUpdate = useCan('categories.update');
    const canDelete = useCan('categories.delete');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openCreateModal = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const openViewModal = (category: Category) => {
        setSelectedCategory(category);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedCategory) {
            router.delete(`/admin/categories/${selectedCategory.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false)
            });
        }
    };

    const columns: Column<Category>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            sortable: true,
            cell: (row: Category) => <span className="font-bold">{row.name}</span>
        },
        {
            header: 'Slug',
            accessorKey: 'slug',
            sortable: true,
            cell: (row: Category) => <span className="text-sm font-mono opacity-60">{row.slug}</span>
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            align: 'center',
            cell: (row: Category) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openViewModal(row)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {canUpdate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => openEditModal(row)}
                        >
                            <Pencil className="h-4 w-4" />
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
            <Head title="Categories Management" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                        <p className="text-sm text-muted-foreground">Manage your blog categories here.</p>
                    </div>
                    {canCreate && (
                        <Button onClick={openCreateModal}>
                            Create Category
                        </Button>
                    )}
                </div>

                <div className="grid gap-4">
                    <DataTable
                        data={categories}
                        columns={columns}
                        searchKey="name"
                    />
                </div>
            </div>

            {/* Create / Edit Modal */}
            <DialogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCategory ? 'Edit Category' : 'Create Category'}
                description={selectedCategory ? 'Update the details for this category.' : 'Add a new category to your blog.'}
            >
                <CategoryForm
                    category={selectedCategory}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </DialogModal>

            {/* View Modal */}
            <DialogModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Category Details"
                description="View information about this category."
            >
                {selectedCategory && (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Name</span>
                            <span className="col-span-2 font-semibold">{selectedCategory.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Slug</span>
                            <span className="col-span-2 font-mono text-sm">{selectedCategory.slug}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ID</span>
                            <span className="col-span-2 text-xs text-muted-foreground font-mono">{selectedCategory.id}</span>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </DialogModal>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            <span className="font-bold text-foreground mx-1">"{selectedCategory?.name}"</span>
                            from the system.
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
