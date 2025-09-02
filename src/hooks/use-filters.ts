import { useLocation, useSearchParams } from 'react-router-dom';

type Primitive = string | number | boolean;
type FilterValues = Record<string, Primitive | Primitive[] | undefined>;

export const useFilters = <T extends FilterValues>(
  defaultFilters: T,
  options?: { keepHash?: boolean }
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const filters = Object.keys(defaultFilters).reduce((acc, key) => {
    const defaultValue = defaultFilters[key];
    if (Array.isArray(defaultValue)) {
      // Get multiple values
      const paramValues = searchParams.getAll(key);
      acc[key as keyof T] =
        paramValues.length > 0
          ? (paramValues.map(v =>
              castValue(v, typeof defaultValue[0])
            ) as any)
          : defaultValue;
    } else {
      // Single value
      const paramValue = searchParams.get(key);
      acc[key as keyof T] =
        paramValue !== null
          ? castValue(paramValue, typeof defaultValue)
          : defaultValue;
    }
    return acc;
  }, {} as T);

  const updateParams = (newParams: URLSearchParams) => {
    const url = {
      search: newParams.toString(),
      hash: options?.keepHash ? location.hash : '',
    };
    setSearchParams(url.search, { replace: true });
    if (options?.keepHash && location.hash) {
      window.history.replaceState(
        null,
        '',
        location.pathname + '?' + url.search + location.hash
      );
    }
  };

  const setFilter = (key: keyof T, value: T[keyof T]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key as string);

    if (Array.isArray(value)) {
      value.forEach(v => newParams.append(key as string, String(v)));
    } else if (value !== undefined && value !== '') {
      newParams.set(key as string, String(value));
    }

    updateParams(newParams);
  };

  const setFilters = (updates: Partial<T>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      newParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach(v => newParams.append(key, String(v)));
      } else if (value !== undefined && value !== '') {
        newParams.set(key, String(value));
      }
    });

    updateParams(newParams);
  };

  const resetFilters = () => {
    const newParams = new URLSearchParams();

    Object.entries(defaultFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => newParams.append(key, String(v)));
      } else if (value !== undefined && value !== '') {
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
