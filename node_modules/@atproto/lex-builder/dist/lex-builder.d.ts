import type { BuildFilterOptions } from './filter.js';
import type { FormatterOptions } from './formatter.js';
import type { LexDefBuilderOptions } from './lex-def-builder.js';
import type { LexiconDirectoryIndexerOptions } from './lexicon-directory-indexer.js';
/**
 * Configuration options for the {@link LexBuilder} class.
 *
 * Extends {@link LexDefBuilderOptions} with additional settings for
 * controlling the generated TypeScript project structure.
 *
 * @see {@link LexDefBuilderOptions} for definition generation options
 */
export type LexBuilderOptions = LexDefBuilderOptions & {
    /**
     * Whether to generate an index file at the root exporting all top-level
     * namespaces.
     *
     * @note This could theoretically cause name conflicts if a
     * @default false
     */
    indexFile?: boolean;
    /**
     * The file extension to use for import specifiers in the generated code.
     *
     * @default '.js'
     */
    importExt?: string;
    /**
     * The file extension to use for generated TypeScript files.
     *
     * @default '.ts'
     */
    fileExt?: string;
    /**
     * Whether to export the whole defs file as a namespace export (`export * as
     * $defs from './xyz.defs.js'`). This is useful to have an escape hatch to
     * access the definitions in case of name conflicts with child namespaces.
     *
     * For example if two documents with if `com.example.foo` and
     * `com.example.foo.bar` coexist, the `com.example.foo.bar` namespace would
     * shadow any `bar` definition from the `com.example.foo` namespace. In that
     * case, having the `$defs` namespace export allows to still access those
     * definitions via `com.example.foo.$defs.bar`.
     *
     * @note enabling this will negatively impact bundle size because and
     * additional namespace object will be generated for each lexicon document.
     *
     * @default false
     */
    defsExport?: boolean;
    /**
     * Whether to generate a default export for the "main" lexicon definition
     * schema in the parent namespace file.
     *
     * This allows simpler access the main schema when importing directly from the
     * file instead of using the full namespace as in:
     * `com.atproto.repo.getRecord`.
     *
     * ```ts
     * import getRecord from './com/atproto/repo/getRecord.js'
     * // instead of
     * import { main as getRecord } from './com/atproto/repo/getRecord.js'
     * ```
     *
     * @default false
     */
    defaultExport?: boolean;
};
/**
 * Options for loading lexicon documents into the builder.
 *
 * Combines directory indexing options with filtering options to control
 * which lexicon documents are processed.
 *
 * @see {@link LexiconDirectoryIndexerOptions} for directory scanning options
 * @see {@link BuildFilterOptions} for include/exclude filtering
 */
export type LexBuilderLoadOptions = LexiconDirectoryIndexerOptions & BuildFilterOptions;
/**
 * Options for saving generated TypeScript files.
 *
 * Combines formatting options with output directory configuration.
 */
export type LexBuilderSaveOptions = FormatterOptions & {
    /**
     * The output directory path where generated TypeScript files will be written.
     */
    out: string;
    /**
     * Whether to clear the output directory before writing files.
     *
     * When `true`, the entire output directory is deleted before writing new files.
     *
     * @default false
     */
    clear?: boolean;
    /**
     * Whether to allow overwriting existing files.
     *
     * When `false`, an error is thrown if any output file already exists.
     *
     * @default false
     */
    override?: boolean;
};
/**
 * Main builder class for generating TypeScript schemas from Lexicon documents.
 *
 * The LexBuilder orchestrates the entire code generation process:
 * 1. Loading and indexing lexicon documents from the filesystem
 * 2. Generating TypeScript type definitions and runtime schemas
 * 3. Creating namespace export trees for convenient imports
 * 4. Saving formatted output files
 *
 * @example
 * ```ts
 * const builder = new LexBuilder({ indexFile: true, pretty: true })
 *
 * // Load lexicons from a directory
 * await builder.load({ lexicons: './lexicons' })
 *
 * // Save generated TypeScript to output directory
 * await builder.save({ out: './src/generated', clear: true })
 * ```
 */
export declare class LexBuilder {
    #private;
    private readonly options;
    constructor(options?: LexBuilderOptions);
    get fileExt(): string;
    get importExt(): string;
    load(options: LexBuilderLoadOptions): Promise<void>;
    save(options: LexBuilderSaveOptions): Promise<void>;
    private createFile;
    private getFile;
    private createExportTree;
    private createDefsFile;
}
//# sourceMappingURL=lex-builder.d.ts.map