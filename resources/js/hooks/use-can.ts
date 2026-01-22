import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

/**
 * Hook to check if the current user has a specific permission.
 * Returns true if the user has the permission or is a super-admin ('*').
 */
export function useCan(permission: string): boolean {
    const { auth } = usePage<SharedData>().props;

    if (!auth || !auth.permissions) {
        return false;
    }

    // Super Admin check
    if (auth.permissions.includes('*')) {
        return true;
    }

    return auth.permissions.includes(permission);
}

/**
 * Helper function to check multiple permissions.
 * Returns true if the user has ANY of the provided permissions.
 */
export function useCanAny(permissions: string[]): boolean {
    const { auth } = usePage<SharedData>().props;

    if (!auth || !auth.permissions) {
        return false;
    }

    if (auth.permissions.includes('*')) {
        return true;
    }

    return permissions.some(p => auth.permissions.includes(p));
}
