import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle2, Circle } from 'lucide-react';

interface Permission {
    id: string;
    name: string;
    group: string;
    description: string;
}

interface Props {
    permissionsByGroup: Record<string, Permission[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Create', href: '/admin/roles/create' },
];

export default function Create({ permissionsByGroup }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
    };

    const handlePermissionChange = (permissionId: string) => {
        const currentPermissions = [...data.permissions];
        if (currentPermissions.includes(permissionId)) {
            setData('permissions', currentPermissions.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...currentPermissions, permissionId]);
        }
    };

    const toggleGroup = (groupPermissions: Permission[]) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => data.permissions.includes(id));

        if (allSelected) {
            setData('permissions', data.permissions.filter(id => !groupIds.includes(id)));
        } else {
            const newPermissions = [...new Set([...data.permissions, ...groupIds])];
            setData('permissions', newPermissions);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="max-w-5xl p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-[#161615] p-8 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Create New Role</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData('name', e.target.value);
                                        // Auto-generate slug if it's empty
                                        if (!data.slug) {
                                            const slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                            setData((prev) => ({ ...prev, name: e.target.value, slug }));
                                        }
                                    }}
                                    placeholder="e.g. Editor"
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Role Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. editor"
                                />
                                {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the purpose of this role"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                        </div>

                        <div className="space-y-6 pt-6 border-t border-[#19140015] dark:border-[#3E3E3A]">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Assign Permissions</h2>
                            </div>

                            <div className="grid gap-8">
                                {Object.entries(permissionsByGroup).map(([group, permissions]) => {
                                    const allInGroupSelected = permissions.every(p => data.permissions.includes(p.id));

                                    return (
                                        <div key={group} className="space-y-4">
                                            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#1C1C1A] p-3 rounded-lg border border-[#19140015] dark:border-[#3E3E3A]">
                                                <h3 className="text-sm font-black uppercase tracking-wider opacity-70">{group}</h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleGroup(permissions)}
                                                    className="h-7 text-[10px] font-bold uppercase"
                                                >
                                                    {allInGroupSelected ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {permissions.map((permission) => {
                                                    const isSelected = data.permissions.includes(permission.id);
                                                    return (
                                                        <label
                                                            key={permission.id}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                                                                    ? 'bg-blue-50/50 border-blue-500 dark:bg-blue-900/10'
                                                                    : 'bg-transparent border-[#19140015] dark:border-[#3E3E3A] hover:bg-gray-50 dark:hover:bg-[#1C1C1A]'
                                                                }`}
                                                        >
                                                            <div className="mt-0.5">
                                                                {isSelected ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                                ) : (
                                                                    <Circle className="h-4 w-4 text-gray-300" />
                                                                )}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isSelected}
                                                                onChange={() => handlePermissionChange(permission.id)}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs">{permission.name.split('.')[1].toUpperCase()}</span>
                                                                <span className="text-[10px] text-muted-foreground leading-tight">{permission.description}</span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.permissions && <p className="text-red-500 text-xs mt-2">{errors.permissions}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.get('/admin/roles')}>Cancel</Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Create Role</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
