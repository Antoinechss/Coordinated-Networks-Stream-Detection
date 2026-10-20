type WWWAuthenticateParams = {
    [authParam in string]: string;
};
/**
 * Parsed representation of a WWW-Authenticate HTTP header.
 *
 * Maps authentication scheme names to either:
 * - A token68 string (compact authentication data)
 * - A params object with key-value pairs
 *
 * @example Bearer with realm
 * ```typescript
 * // WWW-Authenticate: Bearer realm="example"
 * const parsed: WWWAuthenticate = {
 *   Bearer: { realm: 'example' }
 * }
 * ```
 *
 * @example DPoP with error
 * ```typescript
 * // WWW-Authenticate: DPoP error="use_dpop_nonce", error_description="..."
 * const parsed: WWWAuthenticate = {
 *   DPoP: { error: 'use_dpop_nonce', error_description: '...' }
 * }
 * ```
 */
export type WWWAuthenticate = {
    [authScheme in string]: string | WWWAuthenticateParams;
};
/**
 * Returns `undefined` if the header is malformed.
 */
export declare function parseWWWAuthenticateHeader(header?: unknown): undefined | WWWAuthenticate;
export {};
//# sourceMappingURL=www-authenticate.d.ts.map