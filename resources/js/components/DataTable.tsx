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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    RotateCcw,
    Settings2,
    ListFilter,
    FilterX,
    X
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | string;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
}

export interface DataTableFilter {
    key: string;
    label: string;
    options: { label: string; value: string | number }[];
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T | string | (keyof T | string)[];
    itemsPerPage?: number;
    filters?: DataTableFilter[];
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    searchKey,
    itemsPerPage = 10,
    filters = [],
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string | number>>({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        columns.reduce((acc, col) => ({ ...acc, [String(col.accessorKey)]: true }), {})
    );
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
        key: '',
        direction: null,
    });

    const activeColumns = columns.filter(col => visibleColumns[String(col.accessorKey)]);
    const activeFiltersCount = Object.values(selectedFilters).filter(v => v !== 'all' && v !== '').length;

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

    // Helper to get nested value
    const getNestedValue = (obj: any, path: string) => {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Filter and Sort Data
    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // 1. Dynamic Filters
        Object.entries(selectedFilters).forEach(([key, value]) => {
            if (value !== '' && value !== undefined && value !== 'all') {
                result = result.filter(item => {
                    const itemValue = getNestedValue(item, key);
                    // Match either direct value or value within an array (like roles)
                    if (Array.isArray(itemValue)) {
                        return itemValue.some(v => String(v === null ? '' : v.id || v).toLowerCase() === String(value).toLowerCase());
                    }
                    return String(itemValue ?? '').toLowerCase() === String(value).toLowerCase();
                });
            }
        });

        // 2. Search
        if (searchQuery && searchKey) {
            const searchKeys = Array.isArray(searchKey) ? searchKey : [searchKey];
            result = result.filter((item) => {
                return searchKeys.some((key) => {
                    const value = String(getNestedValue(item, String(key)) ?? '').toLowerCase();
                    return value.includes(searchQuery.toLowerCase());
                });
            });
        }

        // 3. Sort
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                let aValue = getNestedValue(a, sortConfig.key);
                let bValue = getNestedValue(b, sortConfig.key);

                // Handle null/undefined
                if (aValue === null || aValue === undefined) aValue = '';
                if (bValue === null || bValue === undefined) bValue = '';

                // Handle numbers vs strings
                const isNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue) &&
                    !isNaN(parseFloat(bValue)) && isFinite(bValue);

                if (isNumeric) {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                } else {
                    aValue = String(aValue).toLowerCase();
                    bValue = String(bValue).toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, searchKey, sortConfig, selectedFilters]);

    // Pagination
    const pageCount = Math.ceil(filteredAndSortedData.length / pageSize);
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRefresh = () => {
        router.reload({ preserveScroll: true } as any);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
                    {searchKey && (
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search everything..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 w-full h-10 bg-background rounded-full border-muted-foreground/20 focus:ring-[#f53003]/20 focus:border-[#f53003]"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {filters.length > 0 && (
                        <Button
                            variant={isFilterVisible ? "secondary" : "outline"}
                            size="sm"
                            className="h-10 rounded-full gap-2 relative border-muted-foreground/20"
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                        >
                            <ListFilter className="h-4 w-4" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f53003] text-[10px] text-white font-bold ring-2 ring-background">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-full gap-2 border-muted-foreground/20"
                        onClick={handleRefresh}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 rounded-full gap-2 border-muted-foreground/20">
                                <Settings2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl overflow-hidden p-1 shadow-2xl border-none ring-1 ring-black/5">
                            {columns.map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={String(column.accessorKey)}
                                    className="capitalize rounded-lg py-2"
                                    checked={visibleColumns[String(column.accessorKey)]}
                                    onCheckedChange={(value) =>
                                        setVisibleColumns((prev) => ({
                                            ...prev,
                                            [String(column.accessorKey)]: !!value,
                                        }))
                                    }
                                >
                                    {column.header}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Smart Filter Panel */}
            {isFilterVisible && filters.length > 0 && (
                <div className="bg-muted/30 border border-muted-foreground/10 rounded-2xl p-6 relative animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filters.map((filter) => (
                            <div key={filter.key} className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">
                                    {filter.label}
                                </Label>
                                <Select
                                    value={String(selectedFilters[filter.key] || 'all')}
                                    onValueChange={(value) => {
                                        setSelectedFilters(prev => ({ ...prev, [filter.key]: value }));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-10 bg-background border-muted-foreground/10 rounded-xl">
                                        <SelectValue placeholder={`All ${filter.label}s`} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl shadow-xl border-none ring-1 ring-black/5">
                                        <SelectItem value="all" className="rounded-lg">All {filter.label}s</SelectItem>
                                        {filter.options.map((opt) => (
                                            <SelectItem key={String(opt.value)} value={String(opt.value)} className="rounded-lg">
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>

                    {activeFiltersCount > 0 && (
                        <div className="mt-6 pt-6 border-t border-muted-foreground/10 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedFilters({});
                                    setCurrentPage(1);
                                }}
                                className="h-9 gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            >
                                <FilterX className="h-4 w-4" />
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                {activeColumns.map((column) => (
                                    <TableHead
                                        key={String(column.accessorKey)}
                                        className={`whitespace-nowrap px-6 h-14 ${column.align === 'center' ? 'text-center' :
                                            column.align === 'right' ? 'text-right' : 'text-left'
                                            }`}
                                    >
                                        {column.sortable ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`-ml-3 h-10 data-[state=open]:bg-accent hover:bg-muted font-black uppercase text-[10px] tracking-wider ${column.align === 'center' ? 'mx-auto' :
                                                    column.align === 'right' ? 'ml-auto mr-0' : ''
                                                    }`}
                                                onClick={() => handleSort(String(column.accessorKey))}
                                            >
                                                <span>{column.header}</span>
                                                {sortConfig.key === column.accessorKey ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-3 w-3" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-3 w-3" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
                                                )}
                                            </Button>
                                        ) : (
                                            <span className="font-black uppercase text-[10px] tracking-wider opacity-60 px-1">{column.header}</span>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors duration-200">
                                        {activeColumns.map((column) => (
                                            <TableCell
                                                key={String(column.accessorKey)}
                                                className={`px-6 py-4 ${column.align === 'center' ? 'text-center' :
                                                    column.align === 'right' ? 'text-right' : 'text-left'
                                                    }`}
                                            >
                                                <div className={`flex ${column.align === 'center' ? 'justify-center' :
                                                    column.align === 'right' ? 'justify-end' : 'justify-start'
                                                    }`}>
                                                    {column.cell ? column.cell(item) : <span className="text-sm">{String(item[column.accessorKey as keyof T] || '')}</span>}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={activeColumns.length} className="h-32 text-center text-muted-foreground animate-pulse">
                                        No results found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing <span className="font-medium text-foreground">{Math.min(filteredAndSortedData.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
                    <span className="font-medium text-foreground">{Math.min(filteredAndSortedData.length, currentPage * pageSize)}</span> of{' '}
                    <span className="font-medium text-foreground">{filteredAndSortedData.length}</span> results
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 order-1 sm:order-2 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold uppercase opacity-60">Rows</p>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px] bg-background">
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
                    <div className="flex items-center justify-center text-xs font-bold uppercase opacity-60">
                        {currentPage} / {pageCount || 1}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount || pageCount === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
                            onClick={() => setCurrentPage(pageCount)}
                            disabled={currentPage === pageCount || pageCount === 0}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
