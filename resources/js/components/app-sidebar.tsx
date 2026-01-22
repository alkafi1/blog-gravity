import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Folder, FolderTree, LayoutGrid, ShieldCheck, Users } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        permission: 'users.view',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
        icon: ShieldCheck,
        permission: 'roles.view',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
        permission: 'categories.view',
    },
    {
        title: 'Subcategories',
        href: '/admin/subcategories',
        icon: Folder,
        permission: 'subcategories.view',
    },
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: FileText,
        permission: 'posts.view',
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
