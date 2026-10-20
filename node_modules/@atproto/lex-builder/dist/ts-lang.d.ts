/**
 * Checks if a word is a JavaScript reserved keyword.
 *
 * @param word - The identifier to check
 * @returns `true` if the word is a reserved keyword
 */
export declare function isJsKeyword(word: string): boolean;
/**
 * Checks if a word is a global identifier that should be avoided.
 *
 * This includes JavaScript globals, TypeScript built-in types, and
 * identifiers commonly used in the generated code.
 *
 * @param word - The identifier to check
 * @returns `true` if the word is a global identifier
 */
export declare function isGlobalIdentifier(word: string): boolean;
/**
 * Checks if a name is safe to use as a local identifier.
 *
 * A safe local identifier is a valid JavaScript identifier that does not
 * conflict with global identifiers.
 *
 * @param name - The identifier to check
 * @returns `true` if the name is safe to use locally
 */
export declare function isSafeLocalIdentifier(name: string): boolean;
/**
 * Checks if a name is a valid JavaScript identifier.
 *
 * Valid identifiers start with a letter, underscore, or dollar sign,
 * followed by any combination of letters, digits, underscores, or dollar
 * signs. Reserved keywords are not valid identifiers.
 *
 * @param name - The string to check
 * @returns `true` if the name is a valid identifier
 */
export declare function isValidJsIdentifier(name: string): boolean;
/**
 * Converts a name to a valid namespace export identifier.
 *
 * If the name is a valid JavaScript identifier, it is returned as-is.
 * Otherwise, it is returned as a quoted string for use in export statements
 * like `export { foo as "unsafe-name" }`.
 *
 * @param name - The export name
 * @returns The name as a valid export identifier
 */
export declare function asNamespaceExport(name: string): string;
//# sourceMappingURL=ts-lang.d.ts.map