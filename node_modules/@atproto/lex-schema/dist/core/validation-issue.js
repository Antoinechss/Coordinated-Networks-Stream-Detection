import { ifCid, isLegacyBlobRef, isPlainObject } from '@atproto/lex-data';
const STRING_PREVIEW_MAX_LENGTH = 256;
const STRING_PREVIEW_TRUNCATED_SUFFIX = '…';
/**
 * Abstract base class for all validation issues.
 *
 * An issue represents a single validation failure, containing:
 * - A code identifying the type of issue
 * - The path to the invalid value in the data structure
 * - The actual input value that failed validation
 *
 * Subclasses add specific properties relevant to each issue type and implement
 * the {@link message} property for human-readable error messages (that don't
 * contain the error path)
 */
export class Issue {
    constructor(code, path, input) {
        this.code = code;
        this.path = path;
        this.input = input;
    }
    /**
     * Returns a human-readable description of the validation issue.
     */
    toString() {
        return `${this.message}${stringifyPath(this.path)}`;
    }
    /**
     * Converts the issue to a JSON-serializable object.
     *
     * @returns An object containing the issue code, path, and message
     */
    toJSON() {
        return {
            code: this.code,
            path: this.path,
            message: this.message,
        };
    }
}
/**
 * A custom validation issue with a user-defined message.
 *
 * Use this for validation rules that don't fit into the standard issue categories.
 */
export class IssueCustom extends Issue {
    constructor(path, input, message) {
        super('custom', path, input);
        this.path = path;
        this.input = input;
        this.message = message;
    }
}
/**
 * Issue for string values that don't match an expected format.
 *
 * Used for AT Protocol specific formats like DID, handle, NSID, AT-URI, etc.
 */
export class IssueInvalidFormat extends Issue {
    constructor(path, input, format, detail) {
        super('invalid_format', path, input);
        this.format = format;
        this.detail = detail;
    }
    get message() {
        return `Invalid ${this.formatDescription}${this.detail ? ` (${this.detail}, ` : ' ('}got ${stringifyValue(this.input)})`;
    }
    /** Returns a human-readable description of the expected format. */
    get formatDescription() {
        switch (this.format) {
            case 'at-identifier':
                return `AT identifier`;
            case 'did':
                return `DID`;
            case 'nsid':
                return `NSID`;
            case 'cid':
                return `CID string`;
            case 'tid':
                return `TID string`;
            case 'record-key':
                return `record key`;
            default:
                return this.format;
        }
    }
    toJSON() {
        return {
            ...super.toJSON(),
            format: this.format,
        };
    }
}
/**
 * Issue for values that have an unexpected type.
 *
 * This is one of the most common validation issues, occurring when the
 * runtime type of a value doesn't match the expected schema type.
 */
export class IssueInvalidType extends Issue {
    constructor(path, input, expected) {
        super('invalid_type', path, input);
        this.expected = expected;
    }
    get message() {
        return `Expected ${oneOf(this.expected.map(stringifyExpectedType))} value type (got ${stringifyValue(this.input)})`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            expected: this.expected,
        };
    }
}
/**
 * Issue for values that don't match any of the expected literal values.
 *
 * Used when a value must be one of a specific set of allowed values
 * (e.g., enum-like constraints).
 */
export class IssueInvalidValue extends Issue {
    constructor(path, input, values) {
        super('invalid_value', path, input);
        this.values = values;
    }
    get message() {
        return `Expected ${oneOf(this.values.map(stringifyValue))} (got ${stringifyValue(this.input)})`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            values: this.values,
        };
    }
}
/**
 * Issue for missing required object properties.
 */
export class IssueRequiredKey extends Issue {
    constructor(path, input, key) {
        super('required_key', path, input);
        this.key = key;
    }
    get message() {
        return `Missing required key "${String(this.key)}"`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            key: this.key,
        };
    }
}
/**
 * Issue for values that exceed a maximum constraint.
 */
export class IssueTooBig extends Issue {
    constructor(path, input, maximum, type, actual) {
        super('too_big', path, input);
        this.maximum = maximum;
        this.type = type;
        this.actual = actual;
    }
    get message() {
        return `${this.type} too big (maximum ${this.maximum}, got ${this.actual})`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            maximum: this.maximum,
        };
    }
}
/**
 * Issue for values that are below a minimum constraint.
 */
export class IssueTooSmall extends Issue {
    constructor(path, input, minimum, type, actual) {
        super('too_small', path, input);
        this.minimum = minimum;
        this.type = type;
        this.actual = actual;
    }
    get message() {
        return `${this.type} too small (minimum ${this.minimum}, got ${this.actual})`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            minimum: this.minimum,
        };
    }
}
// -----------------------------------------------------------------------------
// Helper functions for formatting error messages
// -----------------------------------------------------------------------------
function stringifyExpectedType(expected) {
    if (expected === '$typed') {
        return 'an object which includes the "$type" property';
    }
    return expected;
}
function stringifyPath(path) {
    return ` at ${buildJsonPath(path)}`;
}
function buildJsonPath(path) {
    return `$${path.map(toJsonPathSegment).join('')}`;
}
function toJsonPathSegment(segment) {
    if (typeof segment === 'number' || typeof segment === 'symbol') {
        return `[${String(segment)}]`;
    }
    else if (/^[a-zA-Z_$][a-zA-Z0-9_]*$/.test(segment)) {
        return `.${segment}`;
    }
    else {
        return `[${JSON.stringify(segment)}]`;
    }
}
function oneOf(arr) {
    if (arr.length === 0)
        return '';
    if (arr.length === 1)
        return arr[0];
    return `one of ${arr.slice(0, -1).join(', ')} or ${arr.at(-1)}`;
}
function stringifyValue(value) {
    switch (typeof value) {
        case 'bigint':
            return `${value}n`;
        case 'number':
        case 'boolean':
            return String(value);
        case 'string':
            return JSON.stringify(value.length < STRING_PREVIEW_MAX_LENGTH
                ? value
                : `${value.slice(0, STRING_PREVIEW_MAX_LENGTH - STRING_PREVIEW_TRUNCATED_SUFFIX.length)}${STRING_PREVIEW_TRUNCATED_SUFFIX}`);
        case 'object':
            if (value === null)
                return 'null';
            if (Array.isArray(value)) {
                return `[${stringifyArray(value, stringifyValue)}]`;
            }
            if (isPlainObject(value)) {
                return `{${stringifyArray(Object.entries(value), stringifyObjectEntry)}}`;
            }
            if (ifCid(value))
                return 'cid';
            if (isLegacyBlobRef(value))
                return 'legacy-blob';
            if (value instanceof Date)
                return 'date';
            if (value instanceof RegExp)
                return 'regexp';
            if (value instanceof Map)
                return 'map';
            if (value instanceof Set)
                return 'set';
            return 'object';
        default:
            return typeof value;
    }
}
/*@__NO_SIDE_EFFECTS__*/
function stringifyObjectEntry([key, _value]) {
    return `${JSON.stringify(key)}: ...`;
}
/*@__NO_SIDE_EFFECTS__*/
function stringifyArray(arr, fn, n = 2) {
    return arr.slice(0, n).map(fn).join(', ') + (arr.length > n ? ', ...' : '');
}
//# sourceMappingURL=validation-issue.js.map