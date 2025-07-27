export function updateSearchParam(
    searchParams: URLSearchParams,
    key: string,
    value: string | string[] | null
): URLSearchParams {
    const newParams = new URLSearchParams(searchParams);

    if (value == null || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
    } else if (Array.isArray(value)) {
        newParams.set(key, value.join(","));
    } else {
        newParams.set(key, value);
    }

    return newParams;
}
