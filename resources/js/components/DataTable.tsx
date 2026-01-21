import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | string;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T | string;
    itemsPerPage?: number;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    searchKey,
    itemsPerPage = 10,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
        key: '',
        direction: null,
    });

    // Handle Sorting
    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    // Filter and Sort Data
    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // Search
        if (searchQuery && searchKey) {
            result = result.filter((item) => {
                const value = String(item[searchKey as keyof T] || '').toLowerCase();
                return value.includes(searchQuery.toLowerCase());
            });
        }

        // Sort
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const aValue = String(a[sortConfig.key as keyof T] || '');
                const bValue = String(b[sortConfig.key as keyof T] || '');

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, searchKey, sortConfig]);

    // Pagination
    const pageCount = Math.ceil(filteredAndSortedData.length / pageSize);
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2 w-full">
                    {searchKey && (
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-8 w-full"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead key={String(column.accessorKey)} className="whitespace-nowrap">
                                        {column.sortable ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="-ml-3 h-8 data-[state=open]:bg-accent"
                                                onClick={() => handleSort(String(column.accessorKey))}
                                            >
                                                <span>{column.header}</span>
                                                {sortConfig.key === column.accessorKey ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        ) : (
                                            column.header
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((column) => (
                                            <TableCell key={String(column.accessorKey)} className="whitespace-nowrap">
                                                {column.cell ? column.cell(item) : String(item[column.accessorKey as keyof T] || '')}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {Math.min(filteredAndSortedData.length, (currentPage - 1) * pageSize + 1)} to{' '}
                    {Math.min(filteredAndSortedData.length, currentPage * pageSize)} of{' '}
                    {filteredAndSortedData.length} entries
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 order-1 sm:order-2 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows</p>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {currentPage} of {pageCount || 1}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount || pageCount === 0}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setCurrentPage(pageCount)}
                            disabled={currentPage === pageCount || pageCount === 0}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
