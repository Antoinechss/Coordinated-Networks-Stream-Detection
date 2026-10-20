import { assertAtIdentifierString, assertStringFormat, } from './core.js';
import { object, optional, regexp, string, } from './schema.js';
export function getMain(ns) {
    return 'main' in ns ? ns.main : ns;
}
/**
 * @see {@link https://atproto.com/specs/xrpc#error-responses}
 */
export const lexErrorDataSchema = object({
    // type name of the error (generic ASCII constant, no whitespace)
    error: regexp(/^[\w_-]+$/, 'Expected ASCII constant with no whitespace'),
    // description of the error, appropriate for display to humans
    message: optional(string()),
});
export function atUri(authority, record, rkey) {
    /**
     * @NOTE because we are encoding potentially untrusted input into a URI, we
     * validate the input against the AT Protocol constraints, ensuring that no
     * invalid URIs can be generated.
     */
    switch (typeof record) {
        case 'undefined': {
            assertAtIdentifierString(authority);
            return `at://${authority}`;
        }
        case 'string': {
            if (!rkey) {
                throw new TypeError('Record key is required when record is a string');
            }
            assertAtIdentifierString(authority);
            assertStringFormat(record, 'nsid');
            assertStringFormat(rkey, 'record-key');
            return `at://${authority}/${record}/${rkey}`;
        }
        default: {
            // @NOTE The use of a schema assumes that the collection ($type) is a
            // valid NSID that can safely be included in the URI without additional
            // checks.
            assertAtIdentifierString(authority);
            const schema = getMain(record);
            // @NOTE parsing will apply defaults, so that literal keys will be
            // properly validated and included in the URI.
            return `at://${authority}/${schema.$type}/${schema.keySchema.parse(rkey)}`;
        }
    }
}
//# sourceMappingURL=helpers.js.map