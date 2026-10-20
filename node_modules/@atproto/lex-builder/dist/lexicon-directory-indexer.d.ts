import { LexiconIterableIndexer } from '@atproto/lex-document';
/**
 * Options for the {@link LexiconDirectoryIndexer}.
 *
 * @see {@link ReadLexiconsOptions} for available options
 */
export type LexiconDirectoryIndexerOptions = ReadLexiconsOptions;
/**
 * Indexes lexicon documents from a filesystem directory.
 *
 * This class recursively scans a directory for JSON files, parses them as
 * lexicon documents, and provides an iterable interface for processing them.
 * It extends {@link LexiconIterableIndexer} to support both iteration and
 * lookup by NSID.
 */
export declare class LexiconDirectoryIndexer extends LexiconIterableIndexer {
    constructor(options: LexiconDirectoryIndexerOptions);
}
type ReadLexiconsOptions = {
    lexicons: string;
    ignoreInvalidLexicons?: boolean;
};
export {};
//# sourceMappingURL=lexicon-directory-indexer.d.ts.map