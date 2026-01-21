import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/DataTable';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus, Shield } from 'lucide-react';
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

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function Index({ users }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const canCreate = useCan('users.create');
    const canUpdate = useCan('users.update');
    const canDelete = useCan('users.delete');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedUser) {
            router.delete(`/admin/users/${selectedUser.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false)
            });
        }
    };

    const columns: Column<User>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            sortable: true,
            cell: (row: User) => (
                <div className="flex flex-col">
                    <span className="font-bold">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.email}</span>
                </div>
            )
        },
        {
            header: 'Roles',
            accessorKey: 'roles',
            cell: (row: User) => (
                <div className="flex flex-wrap gap-1">
                    {row.roles.map((role) => (
                        <span key={role.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] uppercase font-bold">
                            <Shield className="h-3 w-3" />
                            {role.name}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            align: 'center',
            cell: (row: User) => (
                <div className="flex items-center gap-2">
                    {canUpdate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            asChild
                        >
                            <Link href={`/admin/users/${row.id}/edit`}>
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
            <Head title="Users Management" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                        <p className="text-sm text-muted-foreground">Manage administrative users and their roles.</p>
                    </div>
                    {canCreate && (
                        <Button asChild className="gap-2">
                            <Link href="/admin/users/create">
                                <UserPlus className="h-4 w-4" />
                                Create User
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid gap-4">
                    <DataTable
                        data={users}
                        columns={columns}
                        searchKey="name"
                    />
                </div>
            </div>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            <span className="font-bold text-foreground mx-1">"{selectedUser?.name}"</span>
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
