import type { NsidString, TidString } from '@atproto/syntax';
/**
 * The valid record key constraint types in a lexicon definition.
 *
 * - `'any'` - Accepts any valid record key
 * - `'nsid'` - Record key must be a valid NSID
 * - `'tid'` - Record key must be a valid TID
 * - `'literal:...'` - Record key must be the exact specified value
 *
 * @example
 * ```typescript
 * const constraint: LexiconRecordKey = 'tid'
 * const literalConstraint: LexiconRecordKey = 'literal:self'
 * ```
 */
export type LexiconRecordKey = 'any' | 'nsid' | 'tid' | `literal:${string}`;
/**
 * Type guard that checks if a value is a valid lexicon record key constraint.
 *
 * @typeParam T - The input type
 * @param key - The value to check
 * @returns `true` if the value is a valid record key constraint
 *
 * @example
 * ```typescript
 * if (isLexiconRecordKey(value)) {
 *   // value is typed as LexiconRecordKey
 *   console.log('Valid constraint:', value)
 * }
 * ```
 */
export declare function isLexiconRecordKey<T>(key: T): key is T & LexiconRecordKey;
/**
 * Validates and returns a value as a lexicon record key constraint, throwing if invalid.
 *
 * @param key - The value to validate
 * @returns The value typed as {@link LexiconRecordKey}
 * @throws {Error} If the value is not a valid record key constraint
 *
 * @example
 * ```typescript
 * const constraint = asLexiconRecordKey('tid')
 * // constraint is typed as LexiconRecordKey
 *
 * asLexiconRecordKey('invalid') // throws Error
 * ```
 */
export declare function asLexiconRecordKey(key: unknown): LexiconRecordKey;
/**
 * Maps a lexicon record key definition to its corresponding string subtype.
 *
 * - `'any'` maps to `string`
 * - `'nsid'` maps to `NsidString`
 * - `'tid'` maps to `TidString`
 * - `'literal:...'` maps to the literal string value
 */
export type RecordKeyValue<Key extends LexiconRecordKey = LexiconRecordKey> = Key extends 'any' ? string : Key extends 'tid' ? TidString : Key extends 'nsid' ? NsidString : Key extends `literal:${infer L extends string}` ? L : never;
//# sourceMappingURL=record-key.d.ts.map