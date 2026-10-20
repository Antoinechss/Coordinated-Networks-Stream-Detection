/*@__NO_SIDE_EFFECTS__*/
export function lazyProperty(obj, key, value) {
    Object.defineProperty(obj, key, {
        value,
        writable: false,
        enumerable: false,
        configurable: true,
    });
    return value;
}
//# sourceMappingURL=lazy-property.js.map