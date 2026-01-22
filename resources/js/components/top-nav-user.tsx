import { usePage } from '@inertiajs/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { Button } from './ui/button';

export function TopNavUser() {
    const { auth } = usePage<SharedData>().props;

    if (!auth.user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-full justify-start px-2 hover:bg-transparent focus-visible:ring-0">
                    <UserInfo user={auth.user} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                align="end"
                side="bottom"
                sideOffset={4}
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
