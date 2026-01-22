import { Link } from '@inertiajs/react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavItem, type SharedData } from '@/types';

import { usePage } from '@inertiajs/react';
import { useCan } from '@/hooks/use-can';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { urlIsActive } = useActiveUrl();
    const { auth } = usePage<SharedData>().props;

    const filteredItems = items.filter(item => {
        if (!item.permission) return true;

        // Super admin bypass
        if (auth.permissions.includes('*')) return true;

        return auth.permissions.includes(item.permission);
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={urlIsActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
