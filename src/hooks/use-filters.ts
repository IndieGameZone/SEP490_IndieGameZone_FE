import { useSearchParams } from 'react-router-dom';

type FilterValues = Record<string, string | number | boolean | undefined>;

export const useFilters = <T extends FilterValues>(defaultFilters: T) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = Object.keys(defaultFilters).reduce((acc, key) => {
        const paramValue = searchParams.get(key);
        acc[key as keyof T] = paramValue !== null
            ? castValue(paramValue, typeof defaultFilters[key])
            : defaultFilters[key];
        return acc;
    }, {} as T);

    const setFilter = (key: keyof T, value: T[keyof T]) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === undefined || value === '') {
            newParams.delete(key as string);
        } else {
            newParams.set(key as string, String(value));
        }
        setSearchParams(newParams);
    };

    const resetFilters = () => {
        const newParams = new URLSearchParams();
        Object.entries(defaultFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                newParams.set(key, String(value));
            }
        });
        setSearchParams(newParams);
    };

    return { filters, setFilter, resetFilters };
};

function castValue(value: string, type: string): any {
    switch (type) {
        case 'number':
            return Number(value);
        case 'boolean':
            return value === 'true';
        default:
            return value;
    }
}
