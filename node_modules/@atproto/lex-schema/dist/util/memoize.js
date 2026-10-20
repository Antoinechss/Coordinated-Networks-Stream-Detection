/*@__NO_SIDE_EFFECTS__*/
export function memoizedOptions(fn) {
    let cache = null;
    return function cached(...args) {
        // Not using the cache if there are args
        if (args.length > 0) {
            return fn(...args);
        }
        if (cache != null) {
            return cache.value;
        }
        const value = fn(...args);
        cache = { value };
        return value;
    };
}
/*@__NO_SIDE_EFFECTS__*/
export function memoizedTransformer(fn) {
    let cache;
    return function cached(key, ...args) {
        if (args.length > 0)
            return fn(key, ...args);
        cache ??= new WeakMap();
        const cached = cache.get(key);
        if (cached)
            return cached;
        const result = fn(key, ...args);
        cache.set(key, result);
        return result;
    };
}
//# sourceMappingURL=memoize.js.map