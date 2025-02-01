export function transformFilter(query) {
    const output = { ...query }; // Clone the original query

    for (const key in query) {
        if (key.startsWith('filter.')) {
            const value = query[key];

            if (typeof value === 'object' && value !== null) {
                for (const operator in value) {
                    const mongoOperator = `$${operator}`; // Convert to $gte, $gt, etc.
                    output[key] = `${mongoOperator}:${value[operator]}`; // Convert value format
                }
            }
        }
    }

    return output;
}
