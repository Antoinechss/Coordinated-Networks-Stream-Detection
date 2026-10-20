import { IssueCustom, } from '../core.js';
/*@__NO_SIDE_EFFECTS__*/
export function refine(schema, refinement) {
    // This is basically the same as monkey patching the "validateInContext"
    // method to the schema, but done in a way that does not mutate the original
    // schema. This is safe to do because Validators don't update their internal
    // state over their lifetime.
    return Object.create(schema, {
        validateInContext: {
            // We do not use an arrow function to avoid creating a closure
            value: validateInContextUnbound.bind({ schema, refinement }),
            enumerable: false,
            writable: false,
            configurable: true,
        },
    });
}
/*@__NO_SIDE_EFFECTS__*/
function validateInContextUnbound(input, ctx) {
    const result = ctx.validate(input, this.schema);
    if (!result.success)
        return result;
    const checkResult = this.refinement.check.call(null, result.value, ctx);
    if (!checkResult) {
        const path = ctx.concatPath(this.refinement.path);
        return ctx.issue(new IssueCustom(path, input, this.refinement.message));
    }
    return result;
}
//# sourceMappingURL=refine.js.map