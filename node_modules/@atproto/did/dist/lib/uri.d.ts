/**
 * @see {@link https://www.w3.org/TR/did-1.0/#dfn-did-fragments}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc3986#section-3.5}
 */
export declare function isFragment(value: string, startIdx?: number, endIdx?: number): boolean;
export declare function isHexDigit(code: number): boolean;
export declare const canParse: (url: string | URL, base?: string | URL) => boolean;
//# sourceMappingURL=uri.d.ts.map