import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, User as UserIcon, Phone } from 'lucide-react';

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: Role[];
}

interface Props {
    user: User;
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Edit', href: '#' },
];

export default function Edit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        roles: user.roles.map(r => r.id) || [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
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
            <Head title={`Edit User: ${user.name}`} />
            <div className="max-w-6xl p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-[#161615] p-8 rounded-2xl border border-[#19140015] dark:border-[#3E3E3A] space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Edit User</h1>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#19140015] dark:border-[#3E3E3A]">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
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
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20">
                            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Change Password</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-500 mb-4">Leave blank if you don't want to change the password.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="bg-white dark:bg-[#1C1C1A]"
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
                                        className="bg-white dark:bg-[#1C1C1A]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#19140015] dark:border-[#3E3E3A]">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Update Roles</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Update the roles for this user. Roles determine the actions they can perform.
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
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Update User</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
