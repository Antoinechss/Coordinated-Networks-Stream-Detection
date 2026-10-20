import { l } from '@atproto/lex-schema';
/**
 * Schema for validating and parsing lexicons manifest files.
 *
 * The manifest tracks which lexicons are installed and how they were resolved.
 * This schema ensures the manifest file conforms to the expected structure.
 */
export declare const lexiconsManifestSchema: l.ObjectSchema<{
    /** Schema version, currently always 1 */
    readonly version: l.LiteralSchema<1>;
    /** Array of NSID strings for directly requested lexicons */
    readonly lexicons: l.ArraySchema<l.StringSchema<{
        readonly format: "nsid";
    }>>;
    /** Map of NSID to resolution info (AT URI and CID) for all installed lexicons */
    readonly resolutions: l.DictSchema<l.StringSchema<{
        readonly format: "nsid";
    }>, l.ObjectSchema<{
        /** AT URI where the lexicon was fetched from */
        readonly uri: l.StringSchema<{
            readonly format: "at-uri";
        }>;
        /** Content identifier (CID) of the lexicon document */
        readonly cid: l.StringSchema<{
            readonly format: "cid";
        }>;
    }>>;
}>;
/**
 * Type representing a parsed lexicons manifest.
 */
export type LexiconsManifest = l.Infer<typeof lexiconsManifestSchema>;
/**
 * Normalizes a lexicons manifest for consistent storage and comparison.
 *
 * This function:
 * - Sorts the `lexicons` array alphabetically
 * - Sorts the `resolutions` object entries by key
 * - Validates the result against the schema
 *
 * Normalization ensures that manifests with the same content produce identical
 * JSON output, making them suitable for version control and comparison.
 *
 * @param manifest - The manifest to normalize
 * @returns A new normalized manifest object
 */
export declare function normalizeLexiconsManifest(manifest: LexiconsManifest): LexiconsManifest;
//# sourceMappingURL=lexicons-manifest.d.ts.map