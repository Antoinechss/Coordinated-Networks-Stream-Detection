import type { LexValue } from '@atproto/lex-data';
import type { InferInput, Schema, Validator } from '../core.js';
import { type ObjectSchema } from './object.js';
export type { LexValue };
type ToBodyMime<TEncoding extends string> = TEncoding extends '*/*' ? `${string}/${string}` : TEncoding extends `${infer T extends string}/*` ? `${T}/${string}` : TEncoding;
type ToBodyType<TEncoding extends string, TSchema, TBinary> = TSchema extends Schema ? InferInput<TSchema> : TEncoding extends `application/json` ? LexValue : TBinary;
/**
 * Infers the type of a Payload's encoding and body.
 *
 * @template TPayload - The Payload type
 * @template TBody - Fallback body type for non-JSON encodings
 */
export type InferPayload<TPayload extends Payload, TBinary> = TPayload extends Payload<infer TEncoding, infer TSchema> ? TEncoding extends string ? {
    encoding: ToBodyMime<TEncoding>;
    body: ToBodyType<TEncoding, TSchema, TBinary>;
} : undefined : never;
/**
 * Converts schema encoding patterns to data encoding types.
 *
 * Handles wildcards like '*\/*' and 'image/*' in MIME types.
 *
 * @template TPayload - The Payload type
 */
export type InferPayloadEncoding<TPayload extends Payload> = TPayload extends Payload<infer TEncoding, any> ? TEncoding extends string ? ToBodyMime<TEncoding> : undefined : never;
/**
 * Infers the body type from a Payload and fallback type.
 *
 * @template TPayload - The Payload type
 * @template TBody - Fallback body type for non-JSON encodings without schema
 */
export type InferPayloadBody<TPayload extends Payload, TBinary> = TPayload extends Payload<infer TEncoding, infer TSchema> ? TEncoding extends string ? ToBodyType<TEncoding, TSchema, TBinary> : undefined : never;
/**
 * Determines valid schema type based on encoding presence.
 *
 * @template E - The encoding string type, or undefined
 */
export type PayloadSchema<E extends string | undefined> = E extends undefined ? undefined : Schema<LexValue> | undefined;
/**
 * Represents a payload definition for Lexicon endpoints.
 *
 * Payloads define the body format for HTTP requests and responses.
 * They consist of an encoding (MIME type) and an optional schema
 * for validating the body content.
 *
 * @template TEncoding - The MIME type string, or undefined for no body
 * @template TPayload - The schema type for body validation
 *
 * @example
 * ```ts
 * const jsonPayload = new Payload('application/json', l.object({ data: l.string() }))
 * const binaryPayload = new Payload('image/*', undefined)
 * const noPayload = new Payload(undefined, undefined)
 * ```
 */
export declare class Payload<const TEncoding extends string | undefined = string | undefined, const TSchema extends PayloadSchema<TEncoding> = PayloadSchema<TEncoding>> {
    readonly encoding: TEncoding;
    readonly schema: TSchema;
    constructor(encoding: TEncoding, schema: TSchema);
    /**
     * Checks whether the given content-type matches the expected payload schema's
     * encoding.
     */
    matchesEncoding(contentType: string | undefined): boolean;
}
/**
 * Creates a payload definition for Lexicon endpoint bodies.
 *
 * Defines the expected MIME type and optional validation schema for
 * request or response bodies.
 *
 * @param encoding - MIME type string (e.g., 'application/json', 'image/*'), or undefined for no body
 * @param validator - Optional schema for validating the body content. Must be undefined if encoding is undefined.
 * @returns A new {@link Payload} instance
 *
 * @example
 * ```ts
 * // JSON payload with schema
 * const output = l.payload('application/json', l.object({
 *   posts: l.array(postSchema),
 *   cursor: l.optional(l.string()),
 * }))
 *
 * // Binary payload (no schema validation)
 * const blobInput = l.payload('*\/*', undefined)
 *
 * // Image payload with wildcard
 * const imageInput = l.payload('image/*', undefined)
 *
 * // No payload (for endpoints without body)
 * const noBody = l.payload()
 * ```
 */
export declare function payload<const E extends string | undefined = undefined, const S extends PayloadSchema<E> = undefined>(encoding?: E, validator?: S): Payload<E, S>;
/**
 * Creates a JSON payload with an object schema.
 *
 * Convenience function for the common case of JSON request/response bodies.
 * Equivalent to `l.payload('application/json', l.object(properties))`.
 *
 * @param properties - Object mapping property names to validators
 * @returns A new {@link Payload} instance with 'application/json' encoding
 *
 * @example
 * ```ts
 * // Query output
 * const profileOutput = l.jsonPayload({
 *   did: l.string({ format: 'did' }),
 *   handle: l.string({ format: 'handle' }),
 *   displayName: l.optional(l.string()),
 * })
 *
 * // Procedure input
 * const createPostInput = l.jsonPayload({
 *   text: l.string({ maxGraphemes: 300 }),
 *   createdAt: l.string({ format: 'datetime' }),
 * })
 * ```
 */
export declare function jsonPayload<P extends Record<string, Validator<undefined | LexValue>>>(properties: P): Payload<'application/json', ObjectSchema<P>>;
//# sourceMappingURL=payload.d.ts.map