/**
 * Aggregates items in an array based on a comparison function and an aggregation function.
 *
 * @param arr - The input array to aggregate.
 * @param cmp - A comparison function that determines if two items belong to the same group.
 * @param agg - An aggregation function that combines items in a group into a single item.
 * @returns An array of aggregated items.
 * @example
 * ```ts
 * const input = [1, 1, 2, 2, 3, 3, 3]
 * const result = arrayAgg(
 *   input,
 *   (a, b) => a === b,
 *   (items) => { value: items[0], sum: items.reduce((sum, item) => sum + item, 0) },
 * )
 * // result is [{ value: 1, sum: 2 }, { value: 2, sum: 4 }, { value: 3, sum: 6 }]
 * ```
 */
export declare function arrayAgg<T, O>(arr: readonly T[], cmp: (a: T, b: T) => boolean, agg: (items: [T, ...T[]]) => O): O[];
//# sourceMappingURL=array-agg.d.ts.map