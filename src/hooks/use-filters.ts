import { useLocation, useSearchParams } from 'react-router-dom';

type FilterValues = Record<string, string | number | boolean | undefined>;

export const useFilters = <T extends FilterValues>(
  defaultFilters: T,
  options?: { keepHash?: boolean }
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const filters = Object.keys(defaultFilters).reduce((acc, key) => {
    const paramValue = searchParams.get(key);
    acc[key as keyof T] =
      paramValue !== null
        ? castValue(paramValue, typeof defaultFilters[key])
        : defaultFilters[key];
    return acc;
  }, {} as T);

  const updateParams = (newParams: URLSearchParams) => {
    const url = {
      search: newParams.toString(),
      hash: options?.keepHash ? location.hash : '',
    };
    setSearchParams(url.search, { replace: true });
    if (options?.keepHash && location.hash) {
      window.history.replaceState(null, '', location.pathname + '?' + url.search + location.hash);
    }
  };

  const setFilter = (key: keyof T, value: T[keyof T]) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '') {
      newParams.delete(key as string);
    } else {
      newParams.set(key as string, String(value));
    }
    updateParams(newParams);
  };

  const setFilters = (updates: Partial<T>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    updateParams(newParams);
  };

  const resetFilters = () => {
    const newParams = new URLSearchParams();
    Object.entries(defaultFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        newParams.set(key, String(value));
      }
    });
    updateParams(newParams);
  };

  return { filters, setFilter, resetFilters, setFilters };
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
