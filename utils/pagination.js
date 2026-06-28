export const PAGE_SIZE = 21;

export function parsePage(pageIn, count) {
    if (pageIn == null) return 0;
    const parsed = parseInt(pageIn);
    if (!isNaN(parsed) && (count / PAGE_SIZE) > parsed) {
        return parsed;
    }
    return 0;
}
