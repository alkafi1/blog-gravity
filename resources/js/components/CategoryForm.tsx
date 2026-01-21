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
import { useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoryFormProps {
    category?: Category | null;
    onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                slug: category.slug,
            });
        } else {
            reset();
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onSuccess();
                if (!category) reset();
            },
        };

        if (category) {
            put(`/admin/categories/${category.id}`, options);
        } else {
            post('/admin/categories', options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Category Name"
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
                    placeholder="category-slug"
                    required
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={processing}>
                    {category ? 'Update Category' : 'Create Category'}
                </Button>
            </div>
        </form>
    );
}
