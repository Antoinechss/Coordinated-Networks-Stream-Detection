import { Schema, } from '../core.js';
/**
 * Schema for referencing typed objects with lazy resolution.
 *
 * Used in typed unions to reference typed object schemas. Requires the
 * `$type` field to be present and match the referenced schema's type.
 * The referenced schema is resolved lazily to support circular references.
 *
 * @template TValidator - The referenced typed object validator type
 *
 * @example
 * ```ts
 * const ref = new TypedRefSchema(() => imageViewSchema)
 * // ref.$type === 'app.bsky.embed.images#view'
 * ```
 */
export class TypedRefSchema extends Schema {
    #getter;
    constructor(getter) {
        // @NOTE In order to avoid circular dependency issues, we don't resolve
        // the schema here. Instead, we resolve it lazily when first accessed.
        super();
        this.type = 'typedRef';
        this.#getter = getter;
    }
    get validator() {
        return this.#getter.call(null);
    }
    get $type() {
        return this.validator.$type;
    }
    validateInContext(input, ctx) {
        const result = ctx.validate(input, this.validator);
        if (!result.success)
            return result;
        if (result.value.$type !== this.$type) {
            return ctx.issueInvalidPropertyValue(result.value, '$type', [this.$type]);
        }
        return result;
    }
}
export function typedRef(get) {
    return new TypedRefSchema(get);
}
//# sourceMappingURL=typed-ref.js.map