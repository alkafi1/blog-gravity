import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface Role {
    id: string;
    name: string;
}

interface Props {
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Create', href: '/admin/users/create' },
];

export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    const handleRoleChange = (roleId: string) => {
        const currentRoles = [...data.roles];
        if (currentRoles.includes(roleId)) {
            setData('roles', currentRoles.filter(id => id !== roleId));
        } else {
            setData('roles', [...currentRoles, roleId]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="max-w-4xl p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-[#161615] p-8 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Create New User</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#19140015] dark:border-[#3E3E3A]">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Assign Roles</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select one or more roles for this user. Permissions are granted automatically based on roles.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <label
                                        key={role.id}
                                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${data.roles.includes(role.id)
                                                ? 'bg-blue-50/50 border-blue-500 dark:bg-blue-900/10'
                                                : 'bg-transparent border-[#19140015] dark:border-[#3E3E3A] hover:bg-gray-50 dark:hover:bg-[#1C1C1A]'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={data.roles.includes(role.id)}
                                            onChange={() => handleRoleChange(role.id)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{role.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <p className="text-red-500 text-xs mt-2">{errors.roles}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.get('/admin/users')}>Cancel</Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Create User</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
