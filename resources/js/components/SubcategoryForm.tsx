import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { type Category, type Subcategory } from '@/types';

interface SubcategoryFormProps {
    subcategory?: Subcategory | null;
    categories: Category[];
    onSuccess: () => void;
}

export function SubcategoryForm({ subcategory, categories, onSuccess }: SubcategoryFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: subcategory?.name || '',
        slug: subcategory?.slug || '',
        category_id: subcategory?.category_id || '' as string | number,
    });

    const [categorySearch, setCategorySearch] = useState('');

    const filteredCategories = useMemo(() => {
        return categories?.filter(category =>
            category.name.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [categories, categorySearch]);

    useEffect(() => {
        if (subcategory) {
            setData({
                name: subcategory.name,
                slug: subcategory.slug,
                category_id: subcategory.category_id,
            });
        } else {
            reset();
        }
    }, [subcategory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onSuccess();
                if (!subcategory) reset();
            },
        };

        if (subcategory) {
            put(`/admin/subcategories/${subcategory.id}`, options);
        } else {
            post('/admin/subcategories', options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="category_id">Parent Category</Label>
                <div className="space-y-2">
                    <Select
                        value={data.category_id.toString()}
                        onValueChange={(value) => setData('category_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="p-0">
                            <div className="sticky top-0 p-2 bg-background border-b z-10">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-50" />
                                    <Input
                                        placeholder="Search categories..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="pl-8 pr-8 h-9 border-none focus-visible:ring-0 shadow-none"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    {categorySearch && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategorySearch('');
                                            }}
                                        >
                                            <X className="h-4 w-4 opacity-50" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-1">
                                {filteredCategories?.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No categories found.
                                    </div>
                                )}
                            </div>
                        </SelectContent>
                    </Select>
                </div>
                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Subcategory Name"
                    required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="subcategory-slug"
                    required
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={processing}>
                    {subcategory ? 'Update Subcategory' : 'Create Subcategory'}
                </Button>
            </div>
        </form>
    );
}
