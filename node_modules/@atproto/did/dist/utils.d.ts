export type Identifier<D extends string, I extends string> = `#${I}` | `${D}#${I}`;
export declare function matchesIdentifier<D extends string, I extends string>(did: D, id: I, candidate: string): candidate is Identifier<D, I>;
//# sourceMappingURL=utils.d.ts.map