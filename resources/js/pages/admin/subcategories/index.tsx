import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type Category, type Subcategory } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/DataTable';
import { DialogModal } from '@/components/DialogModal';
import { SubcategoryForm } from '@/components/SubcategoryForm';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, X } from 'lucide-react';
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

interface Props {
    subcategories: Subcategory[];
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Subcategories', href: '/admin/subcategories' },
];

export default function Index({ subcategories, categories }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    const canCreate = useCan('subcategories.create');
    const canUpdate = useCan('subcategories.update');
    const canDelete = useCan('subcategories.delete');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openCreateModal = () => {
        setSelectedSubcategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsModalOpen(true);
    };

    const openViewModal = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedSubcategory) {
            router.delete(`/admin/subcategories/${selectedSubcategory.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false)
            });
        }
    };

    const columns: Column<Subcategory>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            sortable: true,
            cell: (row: Subcategory) => <span className="font-bold">{row.name}</span>
        },
        {
            header: 'Category',
            accessorKey: 'category.name',
            sortable: true,
            cell: (row: Subcategory) => (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    {row.category?.name}
                </span>
            )
        },
        {
            header: 'Slug',
            accessorKey: 'slug',
            sortable: true,
            cell: (row: Subcategory) => <span className="text-sm font-mono opacity-60">{row.slug}</span>
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            align: 'center' as const,
            cell: (row: Subcategory) => (
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

    const filters = [
        {
            key: 'category.id',
            label: 'Category',
            options: categories.map(c => ({ label: c.name, value: c.id }))
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subcategories Management" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Subcategories</h1>
                        <p className="text-sm text-muted-foreground">Manage your blog subcategories here.</p>
                    </div>
                    {canCreate && (
                        <Button onClick={openCreateModal}>
                            Create Subcategory
                        </Button>
                    )}
                </div>

                <div className="grid gap-4">
                    <DataTable
                        data={subcategories}
                        columns={columns}
                        searchKey={['name', 'category.name']}
                        filters={filters}
                    />
                </div>
            </div>

            {/* Create / Edit Modal */}
            <DialogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
                description={selectedSubcategory ? 'Update the details for this subcategory.' : 'Add a new subcategory to your blog.'}
            >
                <SubcategoryForm
                    subcategory={selectedSubcategory}
                    categories={categories}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </DialogModal>

            {/* View Modal */}
            <DialogModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Subcategory Details"
                description="View information about this subcategory."
            >
                {selectedSubcategory && (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Parent Category</span>
                            <span className="col-span-2 font-semibold text-blue-600">{selectedSubcategory.category?.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Name</span>
                            <span className="col-span-2 font-semibold">{selectedSubcategory.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Slug</span>
                            <span className="col-span-2 font-mono text-sm">{selectedSubcategory.slug}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ID</span>
                            <span className="col-span-2 text-xs text-muted-foreground font-mono">{selectedSubcategory.id}</span>
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
                            This action cannot be undone. This will permanently delete the subcategory
                            <span className="font-bold text-foreground mx-1">"{selectedSubcategory?.name}"</span>
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
